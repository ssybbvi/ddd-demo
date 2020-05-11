import { IBaseIdDbModels } from "../../../shared/infra/database/dbModel/baseIdDbModels";
import { ITenantIdDbModel } from "../../../shared/infra/database/dbModel/tenantIdDbModel";

export interface ICouponUserDbModel extends IBaseIdDbModels, ITenantIdDbModel {
  couponId: string
  userId: string
  isUse: boolean
  useAt: number
}