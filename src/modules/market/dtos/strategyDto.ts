import { IConditionDateDto } from './conditionDateDto'
import { IConditionAmountDto } from './conditionAmountDto'
import { IRewardDiscountDto } from './rewardDiscountDto'
import { IRewardGiveawayDto } from './rewardGiveawayDto'
import { IRewardReliefAmountDto } from './rewardReliefAmountDto'
import { IConditionCommodityQuantityDto } from './conditionCommodityQuantityDto'
import { IConditionCommodityStrategyTagDto } from './conditionCommodityStrategyTagDto'
import { IRewardCouponDto } from './rewardCouponDto'
import { IConditionCouponDto } from './conditionCouponDto'

export interface IStrategyDto {
  _id: string
  name: string
  description: string
  condition: IStrategyConditonDto[]
  reward: IRewardDto
}

export type IStrategyConditonDto =
  | IConditionDateDto
  | IConditionAmountDto
  | IConditionCommodityQuantityDto
  | IConditionCommodityStrategyTagDto
  | IConditionCouponDto
export type IRewardDto = IRewardDiscountDto | IRewardGiveawayDto | IRewardReliefAmountDto | IRewardCouponDto
