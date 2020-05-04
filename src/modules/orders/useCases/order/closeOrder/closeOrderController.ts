import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { CloseOrderUseCase } from './closeOrderUseCase'
import { CloseOrderDto } from './closeOrderDto'
import { CloseOrderErrors } from './closeOrderErrors'

export class CloseOrderController extends BaseController {
  private useCase: CloseOrderUseCase

  constructor(useCase: CloseOrderUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: any, res: express.Response): Promise<any> {
    const dto: CloseOrderDto = { orderId: req.body.orderId }

    try {
      const result = await this.useCase.execute(dto)

      if (result.isLeft()) {
        return this.fail(res, result.value.errorValue())
      }

      return this.ok<void>(res)
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
