import { ValueObject } from '../../../shared/domain/ValueObject'

export interface IRewardCouponProps {
  type: 'coupon'
  couponId: string
}

export class RewardCoupon extends ValueObject<IRewardCouponProps> {}
