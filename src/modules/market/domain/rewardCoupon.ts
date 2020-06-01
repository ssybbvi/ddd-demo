import { ValueObject } from '../../../shared/domain/ValueObject'
import { Result } from '../../../shared/core/Result'
import { Guard, IGuardArgument } from '../../../shared/core/Guard'

export interface IRewardCouponProps {
  type: 'coupon'
  couponId: string
}

export class RewardCoupon extends ValueObject<IRewardCouponProps> {
  private constructor(props: IRewardCouponProps) {
    super(props)
  }

  get type(): string {
    return this.props.type
  }

  get couponId(): string {
    return this.props.couponId
  }

  public static create(props: IRewardCouponProps): Result<RewardCoupon> {
    const guardArgs: IGuardArgument[] = [{ argument: props.couponId, argumentName: 'couponId' }]

    const guardResult = Guard.againstNullOrUndefinedBulk(guardArgs)

    if (!guardResult.succeeded) {
      return Result.fail<RewardCoupon>(guardResult.message)
    }

    const model = new RewardCoupon({
      ...props,
    })

    return Result.ok<RewardCoupon>(model)
  }
}
