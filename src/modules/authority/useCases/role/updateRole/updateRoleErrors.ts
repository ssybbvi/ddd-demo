import { UseCaseError } from '../../../../../shared/core/UseCaseError'
import { Result } from '../../../../../shared/core/Result'

export namespace UpdateRoleErrors {
  export class RoleExistSameNameError extends Result<UseCaseError> {
    constructor(name: string) {
      super(false, {
        message: `已存在名称：“${name}”，请换其他名称`
      } as UseCaseError)
    }
  }
}
