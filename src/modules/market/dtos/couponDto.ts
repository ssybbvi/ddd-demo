import { IConditionDateDto } from "./conditionDateDto";
import { IConditionAmountDto } from "./conditionAmountDto";
import { IRewardReliefAmountDto } from "./rewardReliefAmountDto";
import { IRewardGiveawayDto } from "./rewardGiveawayDto";
import { IRewardDiscountDto } from "./rewardDiscountDto";
import { IConditionCouponDto } from "./conditionCouponDto";

export interface CouponDto {
  name: string
  condition: ICouponConditonDto[]
  reward: IRewardDiscountDto | IRewardGiveawayDto | IRewardReliefAmountDto
}

export type ICouponConditonDto = IConditionDateDto | IConditionAmountDto 