import { UserId } from './userId'
import { UserCreated } from './events/userCreated'
import { JWTToken, RefreshToken } from './jwt'
import { UserLoggedIn } from './events/userLoggedIn'
import { UserDeleted } from './events/userDeleted'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { Result } from '../../../shared/core/Result'
import { AggregateRoot } from '../../../shared/domain/AggregateRoot'
import { UserUpdateInviteRecommendedUserIded } from './events/userUpdateInviteRecommendedUserIded'

export interface UserProps {
  accessToken?: JWTToken
  refreshToken?: RefreshToken
  isDeleted?: boolean
  lastLogin?: number
  createAt?: number
  inviteToken?: string
  inviteRecommendedUserId?: string
}

export class User extends AggregateRoot<UserProps> {
  get userId(): UserId {
    return UserId.create(this._id).getValue()
  }

  get accessToken(): string {
    return this.props.accessToken
  }

  get isDeleted(): boolean {
    return this.props.isDeleted
  }

  get lastLogin(): number {
    return this.props.lastLogin
  }

  get refreshToken(): RefreshToken {
    return this.props.refreshToken
  }

  get createAt(): number {
    return this.props.createAt
  }

  get inviteToken(): string {
    return this.props.inviteToken
  }

  get inviteRecommendedUserId(): string {
    return this.props.inviteRecommendedUserId
  }

  public setInviteRecommendedUserId(inviteRecommendedUserId: string) {
    if (this.props.createAt + 1000 * 60 > Date.now()) {
      this.props.inviteRecommendedUserId = inviteRecommendedUserId
      this.addDomainEvent(new UserUpdateInviteRecommendedUserIded(this))
    }
  }

  public isLoggedIn(): boolean {
    return !!this.props.accessToken && !!this.props.refreshToken
  }

  public setAccessToken(token: JWTToken, refreshToken: RefreshToken): void {
    this.addDomainEvent(new UserLoggedIn(this))
    this.props.accessToken = token
    this.props.refreshToken = refreshToken
    this.props.lastLogin = Date.now()
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

  public static create(props: UserProps, id?: UniqueEntityID, isAddDomainEvent: boolean = false): Result<User> {
    const isNewUser = !!id === false
    const user = new User(
      {
        ...props,
        isDeleted: props.isDeleted ? props.isDeleted : false,
        inviteToken: props.inviteToken ? props.inviteToken : id.toString(),
        createAt: props.createAt ? props.createAt : Date.now(),
      },
      id
    )

    if (isNewUser || isAddDomainEvent) {
      user.addDomainEvent(new UserCreated(user))
    }

    return Result.ok<User>(user)
  }
}
