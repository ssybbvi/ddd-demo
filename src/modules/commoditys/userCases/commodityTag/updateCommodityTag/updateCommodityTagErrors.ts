import { UseCaseError } from '../../../../../shared/core/UseCaseError'
import { Result } from '../../../../../shared/core/Result'

export namespace UpdateCommodityTagErrors {
  export class NotExistKey extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: '该记录存在'
      } as UseCaseError)
    }
  }

}
