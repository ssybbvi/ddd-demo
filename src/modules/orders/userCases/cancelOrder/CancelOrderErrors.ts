import { UseCaseError } from '../../../../shared/core/UseCaseError'
import { Result } from '../../../../shared/core/Result'

export namespace CancelOrderErrors {
  export class OrderNotFound extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `找不到订单`
      } as UseCaseError)
    }
  }


  export class StatusNotUnPaid extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `订单不是未支付状态，无法取消订单`
      } as UseCaseError)
    }
  }
}
