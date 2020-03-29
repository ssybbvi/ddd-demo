import { Result } from '../../../shared/core/Result'
import { ValueObject } from '../../../shared/domain/ValueObject'
import { Guard } from '../../../shared/core/Guard'

interface IUpUserNameProps {
  name: string
}

export class UpUserName extends ValueObject<IUpUserNameProps> {
  public static maxLength: number = 15
  public static minLength: number = 2

  get value(): string {
    return this.props.name
  }

  private constructor(props: IUpUserNameProps) {
    super(props)
  }

  public static create(props: IUpUserNameProps): Result<UpUserName> {
    const usernameResult = Guard.againstNullOrUndefined(props.name, '用户名')
    if (!usernameResult.succeeded) {
      return Result.fail<UpUserName>(usernameResult.message)
    }

    const minLengthResult = Guard.againstAtLeast(this.minLength, props.name)
    if (!minLengthResult.succeeded) {
      return Result.fail<UpUserName>(minLengthResult.message)
    }

    const maxLengthResult = Guard.againstAtMost(this.maxLength, props.name)
    if (!maxLengthResult.succeeded) {
      return Result.fail<UpUserName>(minLengthResult.message)
    }

    return Result.ok<UpUserName>(new UpUserName(props))
  }
}
