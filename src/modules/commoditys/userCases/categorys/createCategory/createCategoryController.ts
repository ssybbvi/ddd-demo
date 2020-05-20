import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { CreateCategoryUseCase } from './createCategoryUseCase'
import { ICreateCategoryDto } from './createCategoryDto'

export class CreateCategoryController extends BaseController {
  private useCase: CreateCategoryUseCase

  constructor(useCase: CreateCategoryUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const dto: ICreateCategoryDto = req.body

    try {
      const result = await this.useCase.execute(dto)

      if (result.isLeft()) {
        return this.fail(res, result.value.errorValue())
      } else {
        return this.ok<void>(res)
      }
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
