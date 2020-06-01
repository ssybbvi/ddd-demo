import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { CreateActivityUseCase } from './createActivityUseCase'
import { ICreateActivityDto } from './createActivityDto'

export class CreateActivityController extends BaseController {
  private useCase: CreateActivityUseCase

  constructor(useCase: CreateActivityUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: any, res: express.Response): Promise<any> {
    try {
      const dto = req.body as ICreateActivityDto

      const result = await this.useCase.execute(dto)

      if (result.isLeft()) {
        return this.fail(res, result.value.errorValue())
      }
      return this.ok<void>(res)
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
