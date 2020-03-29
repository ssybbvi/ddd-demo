import { AggregateRoot } from '../../../shared/domain/AggregateRoot'
import { UpUserPassword } from './upUserPassword'
import { UpUserName } from './upUserName'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { Result } from '../../../shared/core/Result'

export interface IUpUserProps {
  userName: UpUserName
  password: UpUserPassword
  salt?: string
}

export class UpUser extends AggregateRoot<IUpUserProps> {
  get userName(): UpUserName {
    return this.props.userName
  }

  get password(): UpUserPassword {
    return this.props.password
  }

  get salt(): string {
    return this.props.salt
  }

  private constructor(props: IUpUserProps, id?: UniqueEntityID) {
    super(props, id)
  }

  public static create(props: IUpUserProps, id?: UniqueEntityID): Result<UpUser> {
    const isNewUser = !!id === false
    const user = new UpUser(
      {
        ...props
      },
      id
    )

    return Result.ok<UpUser>(user)
  }
}
