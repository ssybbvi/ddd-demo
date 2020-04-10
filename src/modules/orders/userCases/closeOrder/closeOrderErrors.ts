import { UseCaseError } from '../../../../shared/core/UseCaseError'
import { Result } from '../../../../shared/core/Result'

export namespace CloseOrderErrors {
  export class OrderNotFound extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `找不到订单`
      } as UseCaseError)
    }
  }


  export class StatusError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `订单状态错误，无法关闭`
      } as UseCaseError)
    }
  }
}
