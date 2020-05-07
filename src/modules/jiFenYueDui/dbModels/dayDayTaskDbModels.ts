import { IBaseIdDbModels } from "../../../shared/infra/database/dbModel/baseIdDbModels";
import { ITenantIdDbModel } from "../../../shared/infra/database/dbModel/tenantIdDbModel";

export interface IDayDayTaskDbModels extends IBaseIdDbModels, ITenantIdDbModel {

  type: string
  reward: number
  createAt: number
  userId: string
  isReward: boolean
  isOneTime: boolean
}

