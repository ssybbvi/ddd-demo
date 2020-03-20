import { BaseController } from '../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { EditCommodityUseCase } from './editCommodityUseCase'
import { IEditCommodityDto } from './editCommodityDto'

export class EditCommodityController extends BaseController {
  private useCase: EditCommodityUseCase

  constructor(useCase: EditCommodityUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const dto: IEditCommodityDto = req.body as IEditCommodityDto
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
