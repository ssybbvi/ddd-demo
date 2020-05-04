import { ValueObject } from '../../../shared/domain/ValueObject'

export interface IConditionCouponProps {
  type: 'amount'
  couponId: string
}

export class ConditionCoupon extends ValueObject<IConditionCouponProps> {}
