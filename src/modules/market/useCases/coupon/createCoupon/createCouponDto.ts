import { ICouponConditonDto } from '../../../dtos/couponDto'
import { IRewardDiscountDto } from '../../../dtos/rewardDiscountDto'
import { IRewardGiveawayDto } from '../../../dtos/rewardGiveawayDto'
import { IRewardReliefAmountDto } from '../../../dtos/rewardReliefAmountDto'

export interface ICreateCouponDto {
  name: string
  condition: ICouponConditonDto[]
  reward: IRewardDiscountDto | IRewardGiveawayDto | IRewardReliefAmountDto
  receiveLimit: number
  userReceiveLimit: number
}
