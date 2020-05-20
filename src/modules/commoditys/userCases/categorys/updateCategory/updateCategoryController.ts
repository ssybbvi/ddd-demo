import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { UpdateCategoryUseCase } from './updateCategoryUseCase'
import { IUpdateCategoryDto } from './updateCategoryDto'

export class UpdateCategoryController extends BaseController {
  private useCase: UpdateCategoryUseCase

  constructor(useCase: UpdateCategoryUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const dto: IUpdateCategoryDto = req.body

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
