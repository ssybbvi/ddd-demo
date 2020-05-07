import { IBaseIdDbModels } from "../../../shared/infra/database/dbModel/baseIdDbModels";
import { ITenantIdDbModel } from "../../../shared/infra/database/dbModel/tenantIdDbModel";

export interface IPermissionDbModel extends IBaseIdDbModels, ITenantIdDbModel {

  name: string
  discriminator: string
}
