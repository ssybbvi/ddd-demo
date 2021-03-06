import { UseCaseError } from '../../../../../shared/core/UseCaseError'
import { Result } from '../../../../../shared/core/Result'

export namespace CreateOrderErrors {
  export class CommodityNotFound extends Result<UseCaseError> {
    constructor(commodityId: string) {
      super(false, {
        message: `没有该商品编号:${commodityId}`
      } as UseCaseError)
    }
  }


  export class CommodityItemNotNull extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `商品不能为空`
      } as UseCaseError)
    }
  }

}
