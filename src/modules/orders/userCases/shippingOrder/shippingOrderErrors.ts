import { UseCaseError } from '../../../../shared/core/UseCaseError'
import { Result } from '../../../../shared/core/Result'

export namespace ShippingOrderErrors {
  export class OrderNotPayment extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `该订单还未支付`
      } as UseCaseError)
    }
  }


}
