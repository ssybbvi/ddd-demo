import { IBaseIdDbModels } from '../../../shared/infra/database/dbModel/baseIdDbModels'
import { ITenantIdDbModel } from '../../../shared/infra/database/dbModel/tenantIdDbModel'

export interface IAttributeDbModel extends IBaseIdDbModels, ITenantIdDbModel {
  name: string
  categoryId: string
}
