import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { UpdateSpecificationUseCase } from './updateSpecificationUseCase'
import { IUpdateSpecificationDto } from './updateSpecificationDto'

export class UpdateSpecificationController extends BaseController {
  private useCase: UpdateSpecificationUseCase

  constructor(useCase: UpdateSpecificationUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const dto: IUpdateSpecificationDto = req.body

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
