import { AggregateRoot } from '../../../shared/domain/AggregateRoot'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { Result } from '../../../shared/core/Result'
import { Guard } from '../../../shared/core/Guard'
import { AuthorityUserId } from './authorityUserId'
import { AuthorityUserCreated } from './events/authorityUserCreated'
import { RoleId } from './roleId'

interface AuthorityUserProps {
  name: string,
  roleIds: RoleId[]
}

export class AuthorityUser extends AggregateRoot<AuthorityUserProps> {
  get authorityUserId(): AuthorityUserId {
    return AuthorityUserId.create(this._id).getValue()
  }


  get name(): string {
    return this.props.name
  }

  get roleIds(): RoleId[] {
    return this.props.roleIds
  }

  private constructor(props: AuthorityUserProps, id?: UniqueEntityID) {
    super(props, id)
  }

  public static create(props: AuthorityUserProps, id?: UniqueEntityID): Result<AuthorityUser> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.name, argumentName: 'name' }
    ])

    if (!guardResult.succeeded) {
      return Result.fail<AuthorityUser>(guardResult.message)
    }

    const defaultValues: AuthorityUserProps = {
      ...props,
    }

    const authorityUser = new AuthorityUser(defaultValues, id)
    const isNewAuthorityUser = !!id === false

    if (isNewAuthorityUser) {
      authorityUser.addDomainEvent(new AuthorityUserCreated(authorityUser))
    }

    return Result.ok<AuthorityUser>(authorityUser)
  }
}
