import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { CreateCommodityTagUseCase } from './createCommodityTagUseCase'
import { CreateCommodityTagDto } from './createCommodityTagDto'

export class CreateCommodityTagController extends BaseController {
  private useCase: CreateCommodityTagUseCase

  constructor(useCase: CreateCommodityTagUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const { name, description, tag } = req.body
    const dto: CreateCommodityTagDto = {
      name,
      description,
      tag,
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
