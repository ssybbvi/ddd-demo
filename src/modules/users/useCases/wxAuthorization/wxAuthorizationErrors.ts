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

  export class InviteTokenInValidError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `推荐标示无效`
      } as UseCaseError)
    }
  }

  export class LoginForbidInviteTokenError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `登录操作不可以填推荐标示`
      } as UseCaseError)
    }
  }
}
