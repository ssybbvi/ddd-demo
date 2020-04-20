import { IBaseIdDbModels } from "../../../shared/infra/database/baseIdDbModels";

export interface IThirdPartyAppDbModel extends IBaseIdDbModels {
  name: string,
  appId: string
  secret: string
  accessToken: string,
  expiresIn: number,
  createAt: number
}

