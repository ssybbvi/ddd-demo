import { UseCaseError } from './UseCaseError'
import { Result } from './Result'

export class NotFoundError extends Result<UseCaseError> {
  constructor(message: string) {
    super(false, {
      message,
    } as UseCaseError)
  }
}
