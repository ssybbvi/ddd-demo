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
}
