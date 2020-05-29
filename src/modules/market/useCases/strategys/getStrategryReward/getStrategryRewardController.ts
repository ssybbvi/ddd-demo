import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { Strategy } from '../../../domain/strategy'
import { StrategyMap } from '../../../mappers/strategyMap'
import { GetStrategryRewardUseCase } from './getStrategryRewardUseCase'
import { IGetStrategryRewardDto } from './getStrategryRewardDto'

export class GetStrategryRewardController extends BaseController {
  private useCase: GetStrategryRewardUseCase

  constructor(useCase: GetStrategryRewardUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: any, res: express.Response): Promise<any> {
    try {
      const dto = req.body as IGetStrategryRewardDto

      const result = await this.useCase.execute(dto)
      const resultValue = result.value
      if (result.isLeft()) {
        return this.fail(res, result.value.errorValue())
      }

      const strategyList = resultValue.getValue() as Strategy[]
      const strategyDtoList = await StrategyMap.toListDto(strategyList)
      return this.ok(res, strategyDtoList)
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
