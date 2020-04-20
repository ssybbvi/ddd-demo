import { Result } from "../../../../../shared/core/Result";
import { UseCaseError } from "../../../../../shared/core/UseCaseError";

export namespace CreateAuthCodeErrors {
  export class DoseNotExistAppId extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `不存在这个AppID`
      } as UseCaseError)
    }
  }



}
