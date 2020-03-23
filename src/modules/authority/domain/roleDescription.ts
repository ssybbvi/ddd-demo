import { ValueObject } from '../../../shared/domain/ValueObject'
import { Guard } from '../../../shared/core/Guard'
import { Result } from '../../../shared/core/Result'

export interface IRoleDescriptionProps {
  value: string
}

export class RoleDescription extends ValueObject<IRoleDescriptionProps> {
  public static maxLength: number = 15
  public static minLength: number = 2
  get value(): string {
    return this.props.value
  }

  private constructor(props: IRoleDescriptionProps) {
    super(props)
  }

  public static create(props: IRoleDescriptionProps): Result<RoleDescription> {
    const usernameResult = Guard.againstNullOrUndefined(props.value, '角色描述')
    if (!usernameResult.succeeded) {
      return Result.fail<RoleDescription>(usernameResult.message)
    }

    const minLengthResult = Guard.againstAtLeast(this.minLength, props.value)
    if (!minLengthResult.succeeded) {
      return Result.fail<RoleDescription>(minLengthResult.message)
    }

    const maxLengthResult = Guard.againstAtMost(this.maxLength, props.value)
    if (!maxLengthResult.succeeded) {
      return Result.fail<RoleDescription>(minLengthResult.message)
    }

    return Result.ok<RoleDescription>(new RoleDescription(props))
  }
}
