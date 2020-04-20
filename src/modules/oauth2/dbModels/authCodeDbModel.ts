import { IBaseIdDbModels } from "../../../shared/infra/database/baseIdDbModels";

export interface IAuthCodeDbModel extends IBaseIdDbModels {
  appId: string
  code: string
  userId: string
  createAt: number
  expiresIn: number
}