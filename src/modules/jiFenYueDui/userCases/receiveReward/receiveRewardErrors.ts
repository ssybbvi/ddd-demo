import { UseCaseError } from '../../../../shared/core/UseCaseError'
import { Result } from '../../../../shared/core/Result'

export namespace ReceiveRewardErrors {
  export class DayDayTaskNotFound extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `找不到任务`
      } as UseCaseError)
    }
  }

  export class RewardAlreadyReceive extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `奖励已经获取，无法重复获取`
      } as UseCaseError)
    }
  }
}
