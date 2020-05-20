import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { UpdateAttributeUseCase } from './updateAttributeUseCase'
import { IUpdateAttributeDto } from './updateAttributeDto'

export class UpdateAttributeController extends BaseController {
  private useCase: UpdateAttributeUseCase

  constructor(useCase: UpdateAttributeUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const dto: IUpdateAttributeDto = req.body

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
