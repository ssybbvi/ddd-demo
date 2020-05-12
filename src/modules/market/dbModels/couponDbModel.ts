import { IConditionDateDbModel } from "./conditionDateDbModel";
import { IConditionAmountDbModel } from "./conditionAmountDbModel";
import { IRewardReliefAmountDbModel } from "./rewardReliefAmountDbModel";
import { IRewardGiveawayDbModel } from "./rewardGiveawayDbModel";
import { IRewardDiscountDbModel } from "./rewardDiscountDbModel";
import { IBaseIdDbModels } from "../../../shared/infra/database/dbModel/baseIdDbModels";
import { ITenantIdDbModel } from "../../../shared/infra/database/dbModel/tenantIdDbModel";

export interface ICouponDbModel extends IBaseIdDbModels, ITenantIdDbModel {
  name: string
  condition: ICouponConditonDbModel[]
  reward: ICouponRewardDbModel
  receiveLimit: number
  userReceiveLimit: number
}

export type ICouponConditonDbModel = IConditionDateDbModel | IConditionAmountDbModel
export type ICouponRewardDbModel = IRewardDiscountDbModel | IRewardGiveawayDbModel | IRewardReliefAmountDbModel