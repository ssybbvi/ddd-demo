import { ValueObject } from '../../../shared/domain/ValueObject'
import { Guard, IGuardArgument } from '../../../shared/core/Guard'
import { Result } from '../../../shared/core/Result'

export interface ICouponInfoProps {
  couponUserId: string
  couponId: string
  amount?: number
  couponName: string
  couponRewardType: string
  giveawayCommodityId?: string
}

export class CouponInfo extends ValueObject<ICouponInfoProps> {
  private constructor(props: ICouponInfoProps) {
    super(props)
  }

  public couponUserId(): string {
    return this.props.couponUserId
  }

  public couponId(): string {
    return this.props.couponId
  }

  public amount(): number {
    return this.props.amount
  }

  public couponName(): string {
    return this.props.couponName
  }

  public couponRewardType(): string {
    return this.props.couponRewardType
  }

  public giveawayCommodityId(): string {
    return this.props.giveawayCommodityId
  }


  public static create(props: ICouponInfoProps): Result<CouponInfo> {
    const guardArgs: IGuardArgument[] = [
      { argument: props.couponUserId, argumentName: 'couponUserId' },
      { argument: props.couponId, argumentName: 'couponId' },
      { argument: props.couponName, argumentName: 'couponName' },
      { argument: props.couponRewardType, argumentName: 'couponRewardType' },
      { argument: props.giveawayCommodityId, argumentName: 'giveawayCommodityId' },
    ]

    const guardResult = Guard.againstNullOrUndefinedBulk(guardArgs)

    if (!guardResult.succeeded) {
      return Result.fail<CouponInfo>(guardResult.message)
    }

    const model = new CouponInfo({
      ...props,
    })

    return Result.ok<CouponInfo>(model)
  }
}
