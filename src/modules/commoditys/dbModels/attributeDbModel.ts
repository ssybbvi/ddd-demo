import { IBaseIdDbModels } from '../../../shared/infra/database/dbModel/baseIdDbModels'
import { ITenantIdDbModel } from '../../../shared/infra/database/dbModel/tenantIdDbModel'
import { ISpecificationDbModel } from './specificationDbModel'

export interface IAttributeDbModel extends IBaseIdDbModels, ITenantIdDbModel {
  name: string
  specifications: ISpecificationDbModel[]
}
