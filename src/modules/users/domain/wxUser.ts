import { Result } from '../../../shared/core/Result'
import { ValueObject } from '../../../shared/domain/ValueObject'
import { Guard } from '../../../shared/core/Guard'

interface WxUserProps {
  openId: string
  unionId: string
  sessionKey: string
}

export class WxUser extends ValueObject<WxUserProps> {
  get value(): WxUserProps {
    return this.props
  }

  private constructor(props: WxUserProps) {
    super(props)
  }

  public static create(props: WxUserProps): Result<WxUser> {
    return Result.ok<WxUser>(new WxUser(props))
  }
}
