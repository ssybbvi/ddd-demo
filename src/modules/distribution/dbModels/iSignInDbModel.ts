import { IBaseIdDbModels } from "../../../shared/infra/database/dbModel/baseIdDbModels";
import { ITenantIdDbModel } from "../../../shared/infra/database/dbModel/tenantIdDbModel";

export interface ISignInDbModel extends IBaseIdDbModels, ITenantIdDbModel {

  userId: string
  createAt: number
  reward: number
  superReward: number
}
