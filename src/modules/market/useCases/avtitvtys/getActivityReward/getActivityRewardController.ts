import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { Strategy } from '../../../domain/strategy'
import { StrategyMap } from '../../../mappers/strategyMap'
import { GetActivityRewardUseCase } from './getActivityRewardUseCase'
import { IGetActivityRewardDto } from './getActivityRewardDto'

export class GetActivityRewardController extends BaseController {
  private useCase: GetActivityRewardUseCase

  constructor(useCase: GetActivityRewardUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: any, res: express.Response): Promise<any> {
    try {
      const dto = req.body as IGetActivityRewardDto

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
