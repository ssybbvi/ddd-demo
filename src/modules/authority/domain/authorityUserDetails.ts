import { ValueObject } from '../../../shared/domain/ValueObject'
import { Result } from '../../../shared/core/Result'
import { Guard } from '../../../shared/core/Guard'
import { UpUserName } from '../../users/domain/upUserName'

interface AuthorityUserDetailsProps {
  username: UpUserName
  reputation: number
  isAdminUser?: boolean
  isDeleted?: boolean
}

/**
 * @desc Read model for authorityUser
 */

export class AuthorityUserDetails extends ValueObject<AuthorityUserDetailsProps> {
  get username(): UpUserName {
    return this.props.username
  }

  get reputation(): number {
    return this.props.reputation
  }

  get isAdminUser(): boolean {
    return this.props.isAdminUser
  }

  get isDeleted(): boolean {
    return this.props.isDeleted
  }

  private constructor(props: AuthorityUserDetailsProps) {
    super(props)
  }

  public static create(props: AuthorityUserDetailsProps): Result<AuthorityUserDetails> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.username, argumentName: 'username' },
      { argument: props.reputation, argumentName: 'reputation' }
    ])

    if (!guardResult.succeeded) {
      return Result.fail<AuthorityUserDetails>(guardResult.message)
    }

    return Result.ok<AuthorityUserDetails>(
      new AuthorityUserDetails({
        ...props,
        isAdminUser: props.isAdminUser ? props.isAdminUser : false,
        isDeleted: props.isDeleted ? props.isDeleted : false
      })
    )
  }
}
