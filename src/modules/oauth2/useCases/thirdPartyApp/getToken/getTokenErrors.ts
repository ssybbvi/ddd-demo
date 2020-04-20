import { Result } from "../../../../../shared/core/Result";
import { UseCaseError } from "../../../../../shared/core/UseCaseError";

export namespace GetTokenErrors {
  export class DoseNotExistAppId extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `不存在该AppId`
      } as UseCaseError)
    }
  }

  export class AppSecretDotMatch extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `AppId和密钥不匹配`
      } as UseCaseError)
    }
  }


}
