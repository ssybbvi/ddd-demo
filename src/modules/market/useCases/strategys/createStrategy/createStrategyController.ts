import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { CreateStrategyUseCase } from './createStrategyUseCase'
import { ICreateStrategyDto } from './createStrategyDto'

export class CreateStrategyController extends BaseController {
  private useCase: CreateStrategyUseCase

  constructor(useCase: CreateStrategyUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: any, res: express.Response): Promise<any> {
    try {
      const dto = req.body as ICreateStrategyDto

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
