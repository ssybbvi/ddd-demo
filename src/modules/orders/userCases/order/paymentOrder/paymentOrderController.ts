import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { DecodedExpressRequest } from '../../../../users/infra/http/models/decodedRequest'
import { PaymentOrderUseCase } from './paymentOrderUseCase'
import { PaymentOrderDto } from './paymentOrderDto'
import { PaymentOrderErrors } from './paymentOrderErrors'

export class PaymentOrderController extends BaseController {
  private useCase: PaymentOrderUseCase

  constructor(useCase: PaymentOrderUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
    const { userId } = req.decoded;
    const dto: PaymentOrderDto = {
      orderId: req.body.orderId,
      userId: userId
    }

    try {
      const result = await this.useCase.execute(dto)

      if (result.isLeft()) {
        const error = result.value

        switch (error.constructor) {
          case PaymentOrderErrors.DoesNotBelongToYou:
            return this.fail(res, error.errorValue().message)
          case PaymentOrderErrors.OrderNotFound:
            return this.fail(res, error.errorValue().message)
          case PaymentOrderErrors.OrderStatusNotPaid:
            return this.fail(res, error.errorValue().message)
          case PaymentOrderErrors.UnableToPaid:
            return this.fail(res, error.errorValue().message)
          case PaymentOrderErrors.PaymentTimeExpired:
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
