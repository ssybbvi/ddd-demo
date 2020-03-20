import { UserName } from './userName'
import { UserId } from './userId'
import { UserCreated, UserCreatedEventExtra } from './events/userCreated'
import { UserPassword } from './userPassword'
import { JWTToken, RefreshToken } from './jwt'
import { UserLoggedIn } from './events/userLoggedIn'
import { UserDeleted } from './events/userDeleted'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { Result } from '../../../shared/core/Result'
import { Guard } from '../../../shared/core/Guard'
import { AggregateRoot } from '../../../shared/domain/AggregateRoot'
import { WxUser } from './wxUser'
import { UserFrom } from './userFrom'

// export interface PasswordProps {
//   username: UserName
//   password: UserPassword
// }

export interface PlatformProps {
  wx?: WxUser
  //password?: PasswordProps
}

export interface UserProps {
  from?: UserFrom
  accessToken?: JWTToken
  refreshToken?: RefreshToken
  isDeleted?: boolean
  lastLogin?: Date
  platform: PlatformProps
}

export class User extends AggregateRoot<UserProps> {
  get userId(): UserId {
    return UserId.create(this._id).getValue()
  }

  get from(): UserFrom {
    return this.props.from
  }

  get accessToken(): string {
    return this.props.accessToken
  }

  get isDeleted(): boolean {
    return this.props.isDeleted
  }

  get lastLogin(): Date {
    return this.props.lastLogin
  }

  get refreshToken(): RefreshToken {
    return this.props.refreshToken
  }

  get platform(): PlatformProps {
    return this.props.platform
  }

  public isLoggedIn(): boolean {
    return !!this.props.accessToken && !!this.props.refreshToken
  }

  public setAccessToken(token: JWTToken, refreshToken: RefreshToken): void {
    this.addDomainEvent(new UserLoggedIn(this))
    this.props.accessToken = token
    this.props.refreshToken = refreshToken
    this.props.lastLogin = new Date()
  }

  public updatePlatformWx(wx: WxUser): void {
    this.props.platform.wx = wx
  }

  public delete(): void {
    if (!this.props.isDeleted) {
      this.addDomainEvent(new UserDeleted(this))
      this.props.isDeleted = true
    }
  }

  private constructor(props: UserProps, id?: UniqueEntityID) {
    super(props, id)
  }

  public static create(props: UserProps, id?: UniqueEntityID, extra?: UserCreatedEventExtra): Result<User> {
    const isNewUser = !!id === false
    const user = new User(
      {
        ...props,
        isDeleted: props.isDeleted ? props.isDeleted : false
      },
      id
    )

    if (isNewUser) {
      user.addDomainEvent(new UserCreated(user, extra))
    }

    return Result.ok<User>(user)
  }
}
