import { IBaseIdDbModels } from "../../../shared/infra/database/dbModel/baseIdDbModels";
import { ITenantIdDbModel } from "../../../shared/infra/database/dbModel/tenantIdDbModel";

export interface IThirdPartyAppDbModel extends IBaseIdDbModels, ITenantIdDbModel {
  name: string,
  appId: string
  secret: string
  accessToken: string
  expiresIn: number
  createAt: number
}

