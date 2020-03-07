import { Result } from '../../../../shared/core/Result'
import { UseCaseError } from '../../../../shared/core/UseCaseError'

export namespace WxAuthorizationErrors {
  export class WxJsCodeToSessionError extends Result<UseCaseError> {
    constructor(error: string) {
      super(false, {
        message: `微信登录的code无效,${error}`
      } as UseCaseError)
    }
  }
}
