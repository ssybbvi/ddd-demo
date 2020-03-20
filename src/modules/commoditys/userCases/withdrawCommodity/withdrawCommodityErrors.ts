import { UseCaseError } from '../../../../shared/core/UseCaseError'
import { Result } from '../../../../shared/core/Result'

export namespace WithdrawCommodityErrors {
  export class CommodityNotFound extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `没有该商品`
      } as UseCaseError)
    }
  }
 
}
