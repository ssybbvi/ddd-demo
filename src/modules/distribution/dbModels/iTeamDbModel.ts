import { IBaseIdDbModels } from "../../../shared/infra/database/dbModel/baseIdDbModels";
import { ITenantIdDbModel } from "../../../shared/infra/database/dbModel/tenantIdDbModel";

export interface ITeamDbModel extends IBaseIdDbModels, ITenantIdDbModel {

  userId: string
  integral: number
}
