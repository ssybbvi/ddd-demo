import { IBaseIdDbModels } from '../../../shared/infra/database/dbModel/baseIdDbModels'
import { IParticipantDbModel } from './participantDbModel'
import { IDeliveryInfoDbModel } from './deliveryInfoDbModel'
import { ICommodityItemDbModel } from './commodityItemDbModel'
import { IAddressInfoDbModel } from './addressInfoDbModel'
import { ITenantIdDbModel } from '../../../shared/infra/database/dbModel/tenantIdDbModel'

export interface IBargainDbModel extends IBaseIdDbModels, ITenantIdDbModel {
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
  addressInfo: IAddressInfoDbModel
}
