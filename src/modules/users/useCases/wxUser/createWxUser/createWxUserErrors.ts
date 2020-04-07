import { Result } from '../../../../../shared/core/Result'
import { UseCaseError } from '../../../../../shared/core/UseCaseError'

export namespace CreateWxUserErrors {
  export class WxJsCodeToSessionError extends Result<UseCaseError> {
    constructor(error: string) {
      super(false, {
        message: `微信登录的code无效,${error}`
      } as UseCaseError)
    }
  }

  export class OpenIdAlreadyExist extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `OpenId已存在`
      } as UseCaseError)
    }
  }
}
