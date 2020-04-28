import { IDeliveryInfoDto } from "./deliveryInfoDto";

export interface IBargainDto {
  _id: string
  userId: string
  commodityId: string
  name: string,
  currentPrice: number
  price: number
  isSuccess: boolean
  createAt: number
  finishAt: number
  expiredAt: number
  participants: IParticipantsDto[]

  deliveryInfo: IDeliveryInfoDto
}

export interface IParticipantsDto {
  _id: string
  userId: string
  name: string
  price: number
  createAt: number
}