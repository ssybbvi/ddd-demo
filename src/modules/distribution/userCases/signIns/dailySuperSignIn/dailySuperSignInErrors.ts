import { Result } from '../../../../../shared/core/Result'
import { UseCaseError } from '../../../../../shared/core/UseCaseError'

export namespace DailySuperSignInErrors {
  export class NonCompliantErrors extends Result<UseCaseError> {
    constructor(error: string) {
      super(false, {
        message: `未连续打卡，无法获取奖励：原因：${error}`
      } as UseCaseError)
    }
  }
}
