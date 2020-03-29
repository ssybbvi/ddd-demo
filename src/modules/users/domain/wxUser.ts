import { Result } from '../../../shared/core/Result'
import { AggregateRoot } from '../../../shared/domain/AggregateRoot'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'

interface WxUserProps {
  openId: string
  unionId: string
  sessionKey: string
  nickName?: string
  avatarUrl?: string
  gender?: number
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

    return Result.ok<WxUser>(user)
  }
}
