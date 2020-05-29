import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { UpdateStrategyUseCase } from './updateStrategyUseCase'
import { IUpdateStrategyDto } from './updateStrategyDto'

export class UpdateStrategyController extends BaseController {
  private useCase: UpdateStrategyUseCase

  constructor(useCase: UpdateStrategyUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: any, res: express.Response): Promise<any> {
    try {
      const dto = req.body as IUpdateStrategyDto

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
