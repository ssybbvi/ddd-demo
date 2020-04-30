import { IBaseIdDbModels } from "../../../shared/infra/database/baseIdDbModels";

export interface ICommodityItemDbModel extends IBaseIdDbModels {
  name: string
  amount: number
  commodityId: string,
  commodityType: string
}