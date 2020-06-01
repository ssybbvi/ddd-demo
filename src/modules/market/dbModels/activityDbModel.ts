import { IBaseIdDbModels } from '../../../shared/infra/database/dbModel/baseIdDbModels'
import { ITenantIdDbModel } from '../../../shared/infra/database/dbModel/tenantIdDbModel'
import { IStrategyDbModel } from './strategyDbModel'

export interface IActivityDbModel extends IBaseIdDbModels, ITenantIdDbModel {
  isEnable: boolean
  strategy: IStrategyDbModel
}
