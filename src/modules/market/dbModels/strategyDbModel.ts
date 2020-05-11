import { IRewardReliefAmountDbModel } from "./rewardReliefAmountDbModel";
import { IRewardGiveawayDbModel } from "./rewardGiveawayDbModel";
import { IRewardCouponDbModel } from "./rewardCouponDbModel";
import { IRewardDiscountDbModel } from "./rewardDiscountDbModel";
import { IConditionCouponDbModel } from "./conditionCouponDbModel";
import { IConditionDateDbModel } from "./conditionDateDbModel";
import { IConditionAmountDbModel } from "./conditionAmountDbModel";
import { IBaseIdDbModels } from "../../../shared/infra/database/dbModel/baseIdDbModels";
import { ITenantIdDbModel } from "../../../shared/infra/database/dbModel/tenantIdDbModel";

export interface IStrategyDbModel extends IBaseIdDbModels, ITenantIdDbModel {
  name: string
  description: string
  condition: IStrategyConditonDbModel[]
  reward: IRewardCouponDbModel | IRewardDiscountDbModel | IRewardGiveawayDbModel | IRewardReliefAmountDbModel
}

export type IStrategyConditonDbModel = IConditionDateDbModel | IConditionCouponDbModel | IConditionAmountDbModel