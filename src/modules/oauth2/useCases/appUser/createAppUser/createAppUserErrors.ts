import { Result } from "../../../../../shared/core/Result";
import { UseCaseError } from "../../../../../shared/core/UseCaseError";

export namespace CreateAppUserErrors {
  export class ExistUserOpenId extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `已经存在该开放用户记录`
      } as UseCaseError)
    }
  }
}
