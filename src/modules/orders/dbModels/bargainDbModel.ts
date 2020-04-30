import { IBaseIdDbModels } from "../../../shared/infra/database/baseIdDbModels";
import { IParticipantDbModel } from "./participantDbModel";
import { IDeliveryInfoDbModel } from "./deliveryInfoDbModel";
import { ICommodityItemDbModel } from "./commodityItemDbModel";

export interface IBargainDbModel extends IBaseIdDbModels {
  userId: string
  currentAmount: number
  amount: number
  isSuccess: boolean
  createAt: number
  finishAt: number
  expiredAt: number
  commodityItems: ICommodityItemDbModel[]
  participants: IParticipantDbModel[]
  deliveryInfo: IDeliveryInfoDbModel
}


