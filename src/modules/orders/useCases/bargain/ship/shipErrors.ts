import { Result } from "../../../../../shared/core/Result"
import { UseCaseError } from "../../../../../shared/core/UseCaseError"


export namespace ShipErrors {

  export class NotFoundErrors extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `砍价活动没找到`
      } as UseCaseError)
    }
  }


}
