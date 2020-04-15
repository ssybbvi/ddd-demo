import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { DecodedExpressRequest } from '../../../../users/infra/http/models/decodedRequest'
import { DayDayTaskDto } from '../../../dtos/dayDayTaskDto'
import { DayDayTask } from '../../../domain/dayDayTask'
import { DayDayTaskMap } from '../../../mappers/dayDayTaskMap'
import { CompleteTaskUseCase } from './completeTaskUseCase'
import { CompleteTaskDto } from './completeTaskDto'

export class CompleteTaskController extends BaseController {
  private useCase: CompleteTaskUseCase

  constructor(useCase: CompleteTaskUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
    const { userId } = req.decoded
    const { type } = req.body
    const dto: CompleteTaskDto = { userId, type }

    try {
      if (!['browseMall', 'playGame', 'remind'].includes(type)) {
        return this.fail(res, '错误的任务类型')
      }
      const result = await this.useCase.execute(dto)

      if (result.isLeft()) {
        const error = result.value

        switch (error.constructor) {
          default:
            return this.fail(res, error.errorValue().message)
        }
      } else {
        return this.ok<void>(res)
      }
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
