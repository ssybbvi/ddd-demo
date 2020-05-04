import { ValueObject } from '../../../shared/domain/ValueObject'

export interface IRewardDiscountProps {
  type: 'discount'
  discount: number
}

export class RewardDiscount extends ValueObject<IRewardDiscountProps> {}
