import { IBaseIdDbModels } from '../../../shared/infra/database/dbModel/baseIdDbModels'
import { ICancelInfoDbModel } from './cancelInfoDbModel'
import { IPaymentInfoDbModel } from './paymentInfoDbModel'
import { IDeliveryInfoDbModel } from './deliveryInfoDbModel'
import { ICommodityItemDbModel } from './commodityItemDbModel'
import { IAddressInfoDbModel } from './addressInfoDbModel'
import { ITenantIdDbModel } from '../../../shared/infra/database/dbModel/tenantIdDbModel'
import { IStrategyDbModel } from '../../market/dbModels/strategyDbModel'

export interface OrderDbModel extends IBaseIdDbModels, ITenantIdDbModel {
  userId: string
  createAt: number
  totalAmount: number
  toPayAmount: number
  remark: string
  code: string
  couponId: string

  cancelInfo?: ICancelInfoDbModel
  paymentInfo?: IPaymentInfoDbModel
  deliveryInfo?: IDeliveryInfoDbModel
  addressInfo: IAddressInfoDbModel
  commodityItems: ICommodityItemDbModel[]
  strategys: IStrategyDbModel[]
}
