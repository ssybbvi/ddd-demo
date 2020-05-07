import { IBaseIdDbModels } from "../../../shared/infra/database/dbModel/baseIdDbModels";
import { ITenantIdDbModel } from "../../../shared/infra/database/dbModel/tenantIdDbModel";

export interface IOrderUserDbModel extends IBaseIdDbModels, ITenantIdDbModel {
  _id: string
  isAllowBuyOnceCommodity: boolean
}
