import { Result } from '../../../../../shared/core/Result'
import { UseCaseError } from '../../../../../shared/core/UseCaseError'

export namespace DailySignInErrors {
  export class TodayAlreadySignInError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `今天已签到`
      } as UseCaseError)
    }
  }
}
