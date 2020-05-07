import { IBaseIdDbModels } from "../../../shared/infra/database/dbModel/baseIdDbModels";
import { ITenantIdDbModel } from "../../../shared/infra/database/dbModel/tenantIdDbModel";

export interface IPurchaseHistoryDbModel extends IBaseIdDbModels, ITenantIdDbModel {

  userId: string
  commodityId: string
  craeteAt: number
}