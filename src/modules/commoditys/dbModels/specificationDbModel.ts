import { IBaseIdDbModels } from '../../../shared/infra/database/dbModel/baseIdDbModels'
import { ITenantIdDbModel } from '../../../shared/infra/database/dbModel/tenantIdDbModel'

export interface ISpecificationDbModel extends IBaseIdDbModels, ITenantIdDbModel {
  name: string
  attributeId: string
  icon: string
}
