import { ValueObject } from '../../../shared/domain/ValueObject'
import { Guard } from '../../../shared/core/Guard'
import { Result } from '../../../shared/core/Result'

export interface IRoleNameProps {
  value: string
}

export class RoleName extends ValueObject<IRoleNameProps> {
  public static maxLength: number = 15
  public static minLength: number = 2
  get value(): string {
    return this.props.value
  }

  private constructor(props: IRoleNameProps) {
    super(props)
  }

  public static create(props: IRoleNameProps): Result<RoleName> {
    const usernameResult = Guard.againstNullOrUndefined(props.value, '角色名称')
    if (!usernameResult.succeeded) {
      return Result.fail<RoleName>(usernameResult.message)
    }

    const minLengthResult = Guard.againstAtLeast(this.minLength, props.value)
    if (!minLengthResult.succeeded) {
      return Result.fail<RoleName>(minLengthResult.message)
    }

    const maxLengthResult = Guard.againstAtMost(this.maxLength, props.value)
    if (!maxLengthResult.succeeded) {
      return Result.fail<RoleName>(minLengthResult.message)
    }

    return Result.ok<RoleName>(new RoleName(props))
  }
}
