import { UseCaseError } from '../../../../../shared/core/UseCaseError'
import { Result } from '../../../../../shared/core/Result'

export namespace ShippedOrderErrors {
  export class OrderNotPayment extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `该订单还未支付`
      } as UseCaseError)
    }
  }

  export class OrderNotFound extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `没有该订单`
      } as UseCaseError)
    }
  }
}

