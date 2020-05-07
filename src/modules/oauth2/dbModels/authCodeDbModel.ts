import { ITenantIdDbModel } from "../../../shared/infra/database/dbModel/tenantIdDbModel";
import { IBaseIdDbModels } from "../../../shared/infra/database/dbModel/baseIdDbModels";



export interface IAuthCodeDbModel extends IBaseIdDbModels, ITenantIdDbModel {
  appId: string
  code: string
  userId: string
  expiresIn: number
  createAt: number
}