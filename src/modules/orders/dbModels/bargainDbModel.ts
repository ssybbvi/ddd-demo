import { IBaseIdDbModels } from "../../../shared/infra/database/baseIdDbModels";
import { IParticipantDbModel } from "./participantDbModel";
import { IDeliveryInfoDbModel } from "./deliveryInfoDbModel";

export interface IBargainDbModel extends IBaseIdDbModels {
  userId: string
  commodityId: string
  name: string,
  currentPrice: number
  price: number
  isSuccess: boolean
  createAt: number
  finishAt: number
  expiredAt: number
  participants: IParticipantDbModel[]
  deliveryInfo: IDeliveryInfoDbModel
}


