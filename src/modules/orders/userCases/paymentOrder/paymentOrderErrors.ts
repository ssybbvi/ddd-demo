import { UseCaseError } from '../../../../shared/core/UseCaseError'
import { Result } from '../../../../shared/core/Result'

export namespace PaymentOrderErrors {
  export class OrderNotFound extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `没有该订单`
      } as UseCaseError)
    }
  }

  export class OrderStatusNotPaid extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `订单状态不是未支付`
      } as UseCaseError)
    }
  }

  export class UnableToPaid extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `积分不足无法支付`
      } as UseCaseError)
    }
  }

  export class PaymentTimeExpired extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `支付时间已过期`
      } as UseCaseError)
    }
  }

  export class DoesNotBelongToYou extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `该订单不属于你`
      } as UseCaseError)
    }
  }


}
