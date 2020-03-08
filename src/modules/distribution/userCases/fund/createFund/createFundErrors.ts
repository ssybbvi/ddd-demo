import { Result } from '../../../../../shared/core/Result'
import { UseCaseError } from '../../../../../shared/core/UseCaseError'

export namespace CreateFundErrors {
  export class FundAmountError extends Result<UseCaseError> {
    constructor(error: number) {
      super(false, {
        message: `金额无效：${error}`
      } as UseCaseError)
    }
  }
}
