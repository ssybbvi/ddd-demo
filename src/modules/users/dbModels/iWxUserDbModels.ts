import { IBaseIdDbModels } from "../../../shared/infra/database/dbModel/baseIdDbModels";
import { ITenantIdDbModel } from "../../../shared/infra/database/dbModel/tenantIdDbModel";

export interface IWxUserDbModels extends IBaseIdDbModels, ITenantIdDbModel {

  openId: string
  unionId: string
  sessionKey: string
  nickName?: string
  avatarUrl?: string
  gender?: number
  phoneNumber?: string
}
