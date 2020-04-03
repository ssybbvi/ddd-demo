import { UseCaseError } from '../../../../shared/core/UseCaseError'
import { Result } from '../../../../shared/core/Result'

export namespace ReceivedOrderErrors {
  export class OrderNotShipping extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `该订单未发货`
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

