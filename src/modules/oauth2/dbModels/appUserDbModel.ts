import { ITenantIdDbModel } from "../../../shared/infra/database/dbModel/tenantIdDbModel";
import { IBaseIdDbModels } from "../../../shared/infra/database/dbModel/baseIdDbModels";


export interface IAppUserDbModel extends IBaseIdDbModels, ITenantIdDbModel {
  appId: string
  userId: string,
  openUserId: string
  createAt: number
}