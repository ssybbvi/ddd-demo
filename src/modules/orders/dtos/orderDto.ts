import { ICancelInfoDto } from './cancelInfoDto'
import { IPaymentInfoDto } from './paymentInfoDto'
import { IDeliveryInfoDto, IAddressInfoDto } from './deliveryInfoDto'
import { ICommodityItemDto } from './commodityItemDto'
import { IStrategyDto } from '../../market/dtos/strategyDto'

export interface OrderDto {
  _id: string
  userId: string
  createAt: number
  totalAmount: number
  toPayAmount: number
  remark: string
  code: string
  couponId: string

  cancelInfo?: ICancelInfoDto
  paymentInfo?: IPaymentInfoDto
  deliveryInfo?: IDeliveryInfoDto
  addressInfo: IAddressInfoDto
  commodityItems: ICommodityItemDto[]
  strategys: IStrategyDto[]
  status: OrderStatus
}

export type OrderStatus = 'unpaid' | 'cancel' | 'shipping' | 'shipped' | 'received'
