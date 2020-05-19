import { IBaseIdDbModels } from '../../../shared/infra/database/dbModel/baseIdDbModels'
import { ITenantIdDbModel } from '../../../shared/infra/database/dbModel/tenantIdDbModel'
import { IAddressInfoDbModel } from './addressInfoDbModel'

export interface IAddressUserDbModel extends IBaseIdDbModels, ITenantIdDbModel {
  userId: string
  isDefault: boolean
  addressInfo: IAddressInfoDbModel
}
