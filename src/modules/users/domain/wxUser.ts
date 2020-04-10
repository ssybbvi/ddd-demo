import { Result } from '../../../shared/core/Result'
import { AggregateRoot } from '../../../shared/domain/AggregateRoot'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { WxUserCreated } from './events/wxUserCreated'
import { WxUserBindingPhoneNumber } from './events/wxUserBindingPhoneNumber'
import { BindingWxUserInfoed } from './events/bindingWxUserInfoed'

interface WxUserProps {
  openId: string
  unionId: string
  sessionKey: string
  nickName?: string
  avatarUrl?: string
  gender?: number
  phoneNumber?: string
}

export class WxUser extends AggregateRoot<WxUserProps> {
  get openId(): string {
    return this.props.openId
  }

  get unionId(): string {
    return this.props.unionId
  }

  get sessionKey(): string {
    return this.props.sessionKey
  }

  get nickName(): string {
    return this.props.nickName
  }

  get avatarUrl(): string {
    return this.props.avatarUrl
  }

  get gender(): number {
    return this.props.gender
  }

  get phoneNumber(): string {
    return this.props.phoneNumber
  }

  public bindingPhoneNumber(phoneNumber: string) {
    this.props.phoneNumber = phoneNumber
    this.addDomainEvent(new WxUserBindingPhoneNumber(this))
  }

  public bindindUserInfo(nickName: string, avatarUrl: string, gender: number) {
    this.props.nickName = nickName
    this.props.avatarUrl = avatarUrl
    this.props.gender = gender
    this.addDomainEvent(new BindingWxUserInfoed(this))
  }

  public refreshSessionKey(sessionKey: string) {
    this.props.sessionKey = sessionKey
  }

  private constructor(props: WxUserProps, id?: UniqueEntityID) {
    super(props, id)
  }

  public static create(props: WxUserProps, id?: UniqueEntityID): Result<WxUser> {
    const isNewUser = !!id === false
    const user = new WxUser(
      {
        ...props
      },
      id
    )

    if (isNewUser) {
      user.addDomainEvent(new WxUserCreated(user))
    }

    return Result.ok<WxUser>(user)
  }
}
