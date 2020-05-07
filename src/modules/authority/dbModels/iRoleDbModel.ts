import { IBaseIdDbModels } from "../../../shared/infra/database/dbModel/baseIdDbModels";
import { ITenantIdDbModel } from "../../../shared/infra/database/dbModel/tenantIdDbModel";

export interface IRoleDbModel extends IBaseIdDbModels, ITenantIdDbModel {

  name: string
  description: string
  permissionIds: string[]
}
