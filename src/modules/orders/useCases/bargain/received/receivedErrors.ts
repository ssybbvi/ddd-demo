import { Result } from "../../../../../shared/core/Result"
import { UseCaseError } from "../../../../../shared/core/UseCaseError"


export namespace ReceivedErrors {

  export class NotFoundErrors extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `活动没找到`
      } as UseCaseError)
    }
  }

}
