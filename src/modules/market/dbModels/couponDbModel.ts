import { IBaseIdDbModels } from '../../../shared/infra/database/dbModel/baseIdDbModels'
import { ITenantIdDbModel } from '../../../shared/infra/database/dbModel/tenantIdDbModel'

export interface ICouponDbModel extends IBaseIdDbModels, ITenantIdDbModel {
  name: string
  receiveTotal: number
  userReceiveLimit: number
  publishTotal: number
}
