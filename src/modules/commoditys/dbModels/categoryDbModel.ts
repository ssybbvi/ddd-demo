import { IBaseIdDbModels } from '../../../shared/infra/database/dbModel/baseIdDbModels'
import { ITenantIdDbModel } from '../../../shared/infra/database/dbModel/tenantIdDbModel'
import { IAttributeDbModel } from './attributeDbModel'

export interface ICategoryDbModel extends IBaseIdDbModels, ITenantIdDbModel {
  name: string
  parentId: string
  attributes: IAttributeDbModel[]
}
