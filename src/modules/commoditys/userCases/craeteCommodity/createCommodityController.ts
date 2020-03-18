import { BaseController } from '../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { CreateCommodityDto } from './createCommodityDto'
import { CreateCommodityUseCase } from './craeteCommodityCaseUse'

export class CreateCommodityController extends BaseController {
  private useCase: CreateCommodityUseCase

  constructor(useCase: CreateCommodityUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const dto: CreateCommodityDto = req.body as CreateCommodityDto
    try {
      const result = await this.useCase.execute(dto)
      let useCaseValue = result.value
      if (result.isLeft()) {
        const error = useCaseValue

        switch (error.constructor) {
          default:
            return this.fail(res, error.errorValue() + '')
        }
      } else {
        return this.ok<void>(res)
      }
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
