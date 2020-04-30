import { Result } from "../../../../../shared/core/Result"
import { UseCaseError } from "../../../../../shared/core/UseCaseError"


export namespace CreateBargainErrors {

  export class CommodityNotFoundError extends Result<UseCaseError> {
    constructor(commodityId: string) {
      super(false, {
        message: `没有该商品编号:${commodityId}`
      } as UseCaseError)
    }
  }


  export class CommodityItemNotNullError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `商品不能为空`
      } as UseCaseError)
    }
  }

  export class NotBargainCommodityError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `非砍价商品`
      } as UseCaseError)
    }
  }

  export class DotMultipleBargainActivitiesError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `不允许多个活动同时进行`
      } as UseCaseError)
    }
  }

  export class BargainNotFondErrors extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `活动没找到`
      } as UseCaseError)
    }
  }
}
