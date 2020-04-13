import { UseCaseError } from '../../../../../shared/core/UseCaseError'
import { Result } from '../../../../../shared/core/Result'

export namespace GetOrderByIdErrors {
  export class OrderNotFound extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `没有该订单`
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
