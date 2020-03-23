import { UseCaseError } from '../../../../../shared/core/UseCaseError'
import { Result } from '../../../../../shared/core/Result'

export namespace DeleteRoleErrors {
  export class RoleIdIsNullError extends Result<UseCaseError> {
    constructor(name: string) {
      super(false, {
        message: `删除标示不能为空`
      } as UseCaseError)
    }
  }
}
