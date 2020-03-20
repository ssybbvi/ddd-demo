import { UseCaseError } from '../../../../shared/core/UseCaseError'
import { Result } from '../../../../shared/core/Result'

export namespace CreateOrderErrors {
  export class OrderNotFound extends Result<UseCaseError> {
    constructor(commodityId:string) {
      super(false, {
        message: `找不到订单`
      } as UseCaseError)
    }
  }
}
