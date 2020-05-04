import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { DecodedExpressRequest } from '../../../../users/infra/http/models/decodedRequest'
import { DayDayTaskDto } from '../../../dtos/dayDayTaskDto'
import { DayDayTask } from '../../../domain/dayDayTask'
import { DayDayTaskMap } from '../../../mappers/dayDayTaskMap'
import { ReceiveRewardUseCase } from './receiveRewardUseCase'
import { ReceiveRewardDto } from './receiveRewardDto'
import { ReceiveRewardErrors } from './receiveRewardErrors'

export class ReceiveRewardController extends BaseController {
  private useCase: ReceiveRewardUseCase

  constructor(useCase: ReceiveRewardUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
    const { userId } = req.decoded
    const { type } = req.body
    const dto: ReceiveRewardDto = { userId, type }

    try {
      const result = await this.useCase.execute(dto)

      if (result.isLeft()) {
        return this.fail(res, result.value.errorValue())
      } else {
        const dayDayTask = result.value.getValue() as DayDayTask
        const dayDayTaskDto = DayDayTaskMap.toDTO(dayDayTask)
        return this.ok<DayDayTaskDto>(res, dayDayTaskDto)
      }
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
