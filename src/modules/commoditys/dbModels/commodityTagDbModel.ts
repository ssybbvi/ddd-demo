import { IBaseIdDbModels } from "../../../shared/infra/database/dbModel/baseIdDbModels";
import { ITenantIdDbModel } from "../../../shared/infra/database/dbModel/tenantIdDbModel";

export interface ICommodityTagDbModel extends IBaseIdDbModels, ITenantIdDbModel {

  tag: string
  name: string
  description: string
}