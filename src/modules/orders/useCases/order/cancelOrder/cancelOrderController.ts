import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { CancelOrderUseCase } from './cancelOrderUseCase'
import { CancelOrderDto } from './cancelOrderDto'
import { NotFoundError } from '../../../../../shared/core/NotFoundError'
import { AlreadyCanceledError } from '../../../domain/order'

export class CancelOrderController extends BaseController {
  private useCase: CancelOrderUseCase

  constructor(useCase: CancelOrderUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: any, res: express.Response): Promise<any> {
    const dto: CancelOrderDto = { orderId: req.body.orderId }

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
