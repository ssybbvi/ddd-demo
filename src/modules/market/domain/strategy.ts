import { ConditionDate } from './conditionDate'
import { ConditionCoupon } from './conditionCoupon'
import { ConditionAmount } from './conditionAmount'

import { Entity } from '../../../shared/domain/Entity'
import { RewardCoupon } from './rewardCoupon'
import { RewardDiscount } from './rewardDiscount'
import { RewardGiveaway } from './rewardGiveaway'
import { RewardReliefAmount } from './rewardReliefAmount'

export interface IStrategyProps {
  name: string
  description: string
  condition: IStrategyConditon[]
  reward: RewardCoupon | RewardDiscount | RewardGiveaway | RewardReliefAmount
}

export type IStrategyConditon = ConditionDate | ConditionCoupon | ConditionAmount

export class Strategy extends Entity<IStrategyProps> {}
