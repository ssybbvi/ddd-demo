import { UseCaseError } from '../../../../../shared/core/UseCaseError'
import { Result } from '../../../../../shared/core/Result'

export namespace CreateCommodityTagErrors {
  export class ExistKey extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: '该key已存在'
      } as UseCaseError)
    }
  }

}
