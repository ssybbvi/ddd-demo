import { IBaseIdDbModels } from "../../../shared/infra/database/baseIdDbModels";

export interface IAppUserDbModel extends IBaseIdDbModels {
  appId: string
  userId: string,
  openUserId: string
  createAt: number
}