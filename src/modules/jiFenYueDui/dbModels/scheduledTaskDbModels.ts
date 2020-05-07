import { IBaseIdDbModels } from "../../../shared/infra/database/dbModel/baseIdDbModels";
import { ITenantIdDbModel } from "../../../shared/infra/database/dbModel/tenantIdDbModel";

export interface IScheduledTaskDbModels extends IBaseIdDbModels, ITenantIdDbModel {

  argument: any
  userId: string
  type: string
  executionTime: number
  isExecuted: boolean
  createAt?: number
  isSuccess?: boolean
  result?: string
  relationId: string
}
