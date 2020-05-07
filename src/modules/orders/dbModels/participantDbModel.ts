import { IBaseIdDbModels } from "../../../shared/infra/database/dbModel/baseIdDbModels";

export interface IParticipantDbModel extends IBaseIdDbModels {
  userId: string
  amount: number
  weights: number
  createAt: number
}
