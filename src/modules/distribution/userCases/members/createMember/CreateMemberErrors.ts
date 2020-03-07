import { UseCaseError } from '../../../../../shared/core/UseCaseError'
import { Result } from '../../../../../shared/core/Result'

export namespace CreateMemberErrors {
  export class UserDoesntExistError extends Result<UseCaseError> {
    constructor(baseUserId: string) {
      super(false, {
        message: `A user for user id ${baseUserId} doesn't exist or was deleted.`
      } as UseCaseError)
    }
  }

  export class MemberAlreadyExistsError extends Result<UseCaseError> {
    constructor(baseUserId: string) {
      super(false, {
        message: `Member for ${baseUserId} already exists.`
      } as UseCaseError)
    }
  }

  export class InviteMemberNotExists extends Result<UseCaseError> {
    constructor(memberId: string) {
      super(false, {
        message: `Member for ${memberId} not exists.`
      } as UseCaseError)
    }
  }
}
