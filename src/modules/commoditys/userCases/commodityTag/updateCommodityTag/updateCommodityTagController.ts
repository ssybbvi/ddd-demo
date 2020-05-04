import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { UpdateCommodityTagUseCase } from './updateCommodityTagUseCase'
import { UpdateCommodityTagDto } from './updateCommodityTagDto'
import { UpdateCommodityTagErrors } from './updateCommodityTagErrors'

export class UpdateCommodityTagController extends BaseController {
  private useCase: UpdateCommodityTagUseCase

  constructor(useCase: UpdateCommodityTagUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const { _id, name, description } = req.body
    const dto: UpdateCommodityTagDto = {
      _id,
      name,
      description,
    }

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
