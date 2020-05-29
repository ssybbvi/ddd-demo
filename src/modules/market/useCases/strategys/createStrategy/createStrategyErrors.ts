import { Result } from '../../../../../shared/core/Result'
import { UseCaseError } from '../../../../../shared/core/UseCaseError'

export namespace CreateStrategyErrors {
  export class TypeNotFoundError extends Result<UseCaseError> {
    constructor(type: string) {
      super(false, {
        message: `没有该条件类型:${type}`,
      } as UseCaseError)
    }
  }
}
