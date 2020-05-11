import { ValueObject } from '../../../shared/domain/ValueObject'
import { IGuardArgument, Guard } from '../../../shared/core/Guard'
import { Result } from '../../../shared/core/Result'

export interface IConditionCouponProps {
  type: 'coupon'
  couponId: string
}

export class ConditionCoupon extends ValueObject<IConditionCouponProps> {
  private constructor(props: IConditionCouponProps) {
    super(props)
  }

  get type(): string {
    return this.props.type
  }

  get couponId(): string {
    return this.props.couponId
  }


  public static create(props: IConditionCouponProps): Result<ConditionCoupon> {
    const guardArgs: IGuardArgument[] = [
      { argument: props.couponId, argumentName: 'couponId' },
    ]

    const guardResult = Guard.againstNullOrUndefinedBulk(guardArgs)

    if (!guardResult.succeeded) {
      return Result.fail<ConditionCoupon>(guardResult.message)
    }

    const model = new ConditionCoupon({
      ...props,
    })

    return Result.ok<ConditionCoupon>(model)
  }
}
