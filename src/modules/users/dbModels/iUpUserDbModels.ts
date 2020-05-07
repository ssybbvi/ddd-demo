import { IBaseIdDbModels } from "../../../shared/infra/database/dbModel/baseIdDbModels";
import { ITenantIdDbModel } from "../../../shared/infra/database/dbModel/tenantIdDbModel";

export interface IUpUserDbModels extends IBaseIdDbModels, ITenantIdDbModel {

  userName: string
  password: string
  salt?: string
}
