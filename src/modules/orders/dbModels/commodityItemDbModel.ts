import { IBaseIdDbModels } from "../../../shared/infra/database/dbModel/baseIdDbModels";

export interface ICommodityItemDbModel extends IBaseIdDbModels {
  name: string
  amount: number
  commodityId: string,
  commodityType: string
}