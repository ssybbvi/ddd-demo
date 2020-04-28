import { IBaseIdDbModels } from "../../../shared/infra/database/baseIdDbModels";

export interface ICommodityItemDbModel extends IBaseIdDbModels {
  name: string
  price: number
  image: string
  commodityId: string,
  commodityType: string
}