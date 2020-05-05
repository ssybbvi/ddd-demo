import { IBaseIdDbModels } from './baseIdDbModels'

export interface ITenantIdDbModel extends IBaseIdDbModels {
  tenantId: string
}
