import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { Result } from '../../../shared/core/Result'
import { Guard } from '../../../shared/core/Guard'
import { AggregateRoot } from '../../../shared/domain/AggregateRoot'
import { WeiXinId } from './weiXinId'

export interface WeiXinProps {
  openId: string
  unionId: string
  sessionKey: string
  nickName?: string
  avatarUrl?: string
  gender?: number
}

export class WeiXin extends AggregateRoot<WeiXinProps> {
  get openId(): WeiXinId {
    return WeiXinId.create(this._id).getValue()
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

  private constructor(props: WeiXinProps, id?: UniqueEntityID) {
    super(props, id)
  }

  public static create(props: WeiXinProps, id?: UniqueEntityID): Result<WeiXin> {
    const isNewWeiXin = !!id === false
    const weiXin = new WeiXin(
      {
        ...props
      },
      id
    )

    // if (isNewWeiXin) {
    //   weiXin.addDomainEvent(new WeiXinCreated(weiXin, extra))
    // }

    return Result.ok<WeiXin>(weiXin)
  }
}
