import { Result } from "../../../../../shared/core/Result";
import { UseCaseError } from "../../../../../shared/core/UseCaseError";

export namespace AuthorizationCodeErrors {
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

  export class DoseNotExistCode extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `不存在此Code`
      } as UseCaseError)
    }
  }

  export class CodeExpired extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `Code已经过期`
      } as UseCaseError)
    }
  }

  export class DoseNotExistAppUser extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `不存在用户开放记录`
      } as UseCaseError)
    }
  }
}
