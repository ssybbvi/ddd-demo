import { AggregateRoot } from '../../../shared/domain/AggregateRoot'
import { Strategy } from './strategy'
import { ConditionDate } from './conditionDate'
import { ConditionAmount } from './conditionAmount'
import { RewardReliefAmount } from './rewardReliefAmount'
import { RewardDiscount } from './rewardDiscount'
import { RewardGiveaway } from './rewardGiveaway'

export interface ICouponProps {
  name: string
  condition: ICouponConditon[]
  reward: RewardDiscount | RewardGiveaway | RewardReliefAmount
}

export type ICouponConditon = ConditionDate | ConditionAmount

export interface Coupon extends AggregateRoot<ICouponProps> {}
