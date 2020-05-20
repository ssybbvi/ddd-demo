import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { CreateAttributeUseCase } from './createAttributeUseCase'
import { ICreateAttributeDto } from './createAttributeDto'

export class CreateAttributeController extends BaseController {
  private useCase: CreateAttributeUseCase

  constructor(useCase: CreateAttributeUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const dto: ICreateAttributeDto = req.body

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
