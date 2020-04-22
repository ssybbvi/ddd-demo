import { UseCaseError } from '../../../../../shared/core/UseCaseError'
import { Result } from '../../../../../shared/core/Result'

export namespace InviteBargainOrderErrors {

  export class BargainNotFondErrors extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `活动没找到`
      } as UseCaseError)
    }
  }

  export class ExpiredError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `活动已过期`
      } as UseCaseError)
    }
  }

  export class IsFinishError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `活动已结束`
      } as UseCaseError)
    }
  }

  export class HasParticipantError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `无法重复砍价`
      } as UseCaseError)
    }
  }
}
