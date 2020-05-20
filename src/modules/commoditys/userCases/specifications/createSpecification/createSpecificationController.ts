import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { CreateSpecificationUseCase } from './createSpecificationUseCase'
import { ICreateSpecificationDto } from './createSpecificationDto'

export class CreateSpecificationController extends BaseController {
  private useCase: CreateSpecificationUseCase

  constructor(useCase: CreateSpecificationUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const dto: ICreateSpecificationDto = req.body

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
