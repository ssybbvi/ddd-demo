import { UseCaseError } from '../../../../../shared/core/UseCaseError'
import { Result } from '../../../../../shared/core/Result'

export namespace CreateRecommendedUserErrors {
  export class UserDoesntExistError extends Result<UseCaseError> {
    constructor(baseUserId: string) {
      super(false, {
        message: `A user for user id ${baseUserId} doesn't exist or was deleted.`
      } as UseCaseError)
    }
  }

  export class RecommendedUserAlreadyExistsError extends Result<UseCaseError> {
    constructor(baseUserId: string) {
      super(false, {
        message: `RecommendedUser for ${baseUserId} already exists.`
      } as UseCaseError)
    }
  }

  export class InviteRecommendedUserNotExists extends Result<UseCaseError> {
    constructor(recommendedUserId: string) {
      super(false, {
        message: `RecommendedUser for ${recommendedUserId} not exists.`
      } as UseCaseError)
    }
  }
}
