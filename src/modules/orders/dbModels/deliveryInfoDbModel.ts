import { IOrderAddressDbModel } from "./orderAddressDbModel";

export interface IDeliveryInfoDbModel {
  code?: string
  beginAt?: number
  finishAt?: number
  type?: string

  address: IOrderAddressDbModel
}