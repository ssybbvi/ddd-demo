import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { DecodedExpressRequest } from '../../../../users/infra/http/models/decodedRequest'
import { CancelOrderUseCase } from './cancelOrderUseCase'
import { CancelOrderDto } from './cancelOrderDto'
import { CancelOrderErrors } from './CancelOrderErrors'



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
        const error = result.value

        switch (error.constructor) {
          case CancelOrderErrors.OrderNotFound:
            return this.fail(res, error.errorValue().message)
          case CancelOrderErrors.StatusNotUnPaid:
            return this.fail(res, error.errorValue().message)
          default:
            return this.fail(res, error.errorValue().message)
        }
      }

      return this.ok<void>(res)
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
