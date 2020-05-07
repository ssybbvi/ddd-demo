import { IBaseIdDbModels } from "../../../shared/infra/database/dbModel/baseIdDbModels";
import { ITenantIdDbModel } from "../../../shared/infra/database/dbModel/tenantIdDbModel";

export interface IAuthorityUserDbModel extends IBaseIdDbModels, ITenantIdDbModel {
  name: string
  roleIds: string[]
}
