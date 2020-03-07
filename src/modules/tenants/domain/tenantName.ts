import { Result } from '../../../shared/core/Result'
import { ValueObject } from '../../../shared/domain/ValueObject'
import { Guard } from '../../../shared/core/Guard'

export interface ITenantNameProps {
  tenantName: string
}

export class TenantName extends ValueObject<ITenantNameProps> {
  public static maxLength: number = 15
  public static minLength: number = 2

  get value(): string {
    return this.props.tenantName
  }

  private constructor(props: ITenantNameProps) {
    super(props)
  }

  public static create(props: ITenantNameProps): Result<TenantName> {
    const usernameResult = Guard.againstNullOrUndefined(props.tenantName, '租户名称')
    if (!usernameResult.succeeded) {
      return Result.fail<TenantName>(usernameResult.message)
    }

    const minLengthResult = Guard.againstAtLeast(this.minLength, props.tenantName)
    if (!minLengthResult.succeeded) {
      return Result.fail<TenantName>(minLengthResult.message)
    }

    const maxLengthResult = Guard.againstAtMost(this.maxLength, props.tenantName)
    if (!maxLengthResult.succeeded) {
      return Result.fail<TenantName>(minLengthResult.message)
    }
    return Result.ok<TenantName>(new TenantName(props))
  }
}
