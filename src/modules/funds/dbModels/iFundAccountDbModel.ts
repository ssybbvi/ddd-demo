import { ITenantIdDbModel } from "../../../shared/infra/database/dbModel/tenantIdDbModel";
import { IBaseIdDbModels } from "../../../shared/infra/database/dbModel/baseIdDbModels";

export interface IFundAccountDbModel extends IBaseIdDbModels, ITenantIdDbModel {

  totalAmount: number
}
