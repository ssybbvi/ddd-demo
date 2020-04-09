import { Result } from '../../../../../shared/core/Result'
import { UseCaseError } from '../../../../../shared/core/UseCaseError'

export namespace RecommendedByInviteTokenErrors {
  export class InviteTokenInValidError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `推荐标示无效`
      } as UseCaseError)
    }
  }

  export class DontRecommendMyself extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `无法推荐自己`
      } as UseCaseError)
    }
  }

  export class DontRepeatRecommend extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `无法重复推荐`
      } as UseCaseError)
    }
  }
}
