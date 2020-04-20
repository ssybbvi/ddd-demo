import { Result } from "../../../../../shared/core/Result";
import { UseCaseError } from "../../../../../shared/core/UseCaseError";

export namespace CreateThirdPartyAppErrors {
  export class ExistName extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `已经存在该名称了`
      } as UseCaseError)
    }
  }



}
