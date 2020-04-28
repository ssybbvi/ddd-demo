import { IBaseIdDbModels } from "../../../shared/infra/database/baseIdDbModels";

export interface IParticipantDbModel extends IBaseIdDbModels {
  userId: string
  name: string
  price: number
  weights: number
  createAt: number
}
