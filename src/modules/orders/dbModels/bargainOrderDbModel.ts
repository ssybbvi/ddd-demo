import { IBaseIdDbModels } from "../../../shared/infra/database/baseIdDbModels";

export interface IBargainOrderDbModel extends IBaseIdDbModels {
  userId: string
  commodityId: string
  name: string,
  currentPrice: number
  price: number
  isSuccess: boolean
  createAt: number
  finishAt: number
  expiredAt: number
  participants: IParticipantsDbModel[]

  userName: string
  provinceName: string,
  cityName: string,
  countyName: string,
  detailAddressInfo: string,
  nationalCode: string,
  telNumber: string
}

export interface IParticipantsDbModel extends IBaseIdDbModels {
  _id: string
  bargainOrderId: string
  userId: string
  name: string
  price: number
  createAt: number
}