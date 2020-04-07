import { UseCaseError } from '../../../../../shared/core/UseCaseError'
import { Result } from '../../../../../shared/core/Result'

export namespace CreateUpUserErrors {
  export class UserNameExistError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `用户名已存在.`
      } as UseCaseError)
    }
  }
}
