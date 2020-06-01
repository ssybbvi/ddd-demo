import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { UpdateActivityUseCase } from './updateActivityUseCase'
import { IUpdateActivityDto } from './updateActivityDto'

export class UpdateActivityController extends BaseController {
  private useCase: UpdateActivityUseCase

  constructor(useCase: UpdateActivityUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: any, res: express.Response): Promise<any> {
    try {
      const dto = req.body as IUpdateActivityDto

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
