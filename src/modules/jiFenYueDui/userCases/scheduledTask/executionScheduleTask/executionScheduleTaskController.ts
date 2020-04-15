import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { ExecutionScheduleTaskUseCase } from './executionScheduleTaskUseCase'

export class ExecutionScheduleTaskController extends BaseController {
  private useCase: ExecutionScheduleTaskUseCase

  constructor(useCase: ExecutionScheduleTaskUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: any, res: express.Response): Promise<any> {
    try {
      const result = await this.useCase.execute({})

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
