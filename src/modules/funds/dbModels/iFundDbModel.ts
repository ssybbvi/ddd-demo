import { IBaseIdDbModels } from "../../../shared/infra/database/dbModel/baseIdDbModels";
import { ITenantIdDbModel } from "../../../shared/infra/database/dbModel/tenantIdDbModel";

export interface IFundDbModel extends IBaseIdDbModels, ITenantIdDbModel {

  amount: number
  incomeUserId: string
  paymentUserId: string
  status: string
  createAt: number
  descrpiton: string
  type: string
  relationId: string
}
