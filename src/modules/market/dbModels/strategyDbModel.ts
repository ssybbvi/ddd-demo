import { IRewardReliefAmountDbModel } from './rewardReliefAmountDbModel'
import { IRewardGiveawayDbModel } from './rewardGiveawayDbModel'
import { IRewardCouponDbModel } from './rewardCouponDbModel'
import { IRewardDiscountDbModel } from './rewardDiscountDbModel'
import { IConditionCouponDbModel } from './conditionCouponDbModel'
import { IConditionDateDbModel } from './conditionDateDbModel'
import { IConditionAmountDbModel } from './conditionAmountDbModel'
import { IBaseIdDbModels } from '../../../shared/infra/database/dbModel/baseIdDbModels'
import { ITenantIdDbModel } from '../../../shared/infra/database/dbModel/tenantIdDbModel'
import { IConditionCommodityQuantityDbModel } from './conditionCommodityQuantityDbModel'
import { IConditionCommodityStrategyTagDbModel } from './conditionCommodityStrategyTagDbModel'

export interface IStrategyDbModel extends IBaseIdDbModels, ITenantIdDbModel {
  name: string
  description: string
  condition: IStrategyConditonDbModel[]
  reward: IStrategyRewardDbModel
}

export type IStrategyConditonDbModel =
  | IConditionDateDbModel
  | IConditionCouponDbModel
  | IConditionAmountDbModel
  | IConditionCommodityQuantityDbModel
  | IConditionCommodityStrategyTagDbModel
export type IStrategyRewardDbModel =
  | IRewardCouponDbModel
  | IRewardDiscountDbModel
  | IRewardGiveawayDbModel
  | IRewardReliefAmountDbModel