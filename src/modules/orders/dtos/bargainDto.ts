import { IDeliveryInfoDto } from "./deliveryInfoDto";
import { IParticipantDto } from "./participantDto";
import { ICommodityItemDto } from "./commodityItemDto";

export interface IBargainDto {
  _id: string
  userId: string
  currentAmount: number
  amount: number
  isSuccess: boolean
  createAt: number
  finishAt: number
  expiredAt: number
  participants: IParticipantDto[]
  commodityItems: ICommodityItemDto[]
  deliveryInfo: IDeliveryInfoDto
}

