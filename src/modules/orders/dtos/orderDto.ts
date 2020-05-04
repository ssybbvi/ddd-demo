import { ICancelInfoDto } from './cancelInfoDto'
import { IPaymentInfoDto } from './paymentInfoDto'
import { IDeliveryInfoDto, IAddressInfoDto } from './deliveryInfoDto'

export interface OrderDto {
  _id: string
  userId: string
  createAt: number
  totalAmount: number
  remark: string
  code: string

  cancelInfo?: ICancelInfoDto
  paymentInfo?: IPaymentInfoDto
  deliveryInfo?: IDeliveryInfoDto
  addressInfo: IAddressInfoDto
  commodityItems: CommodityItemDto[]

  status: OrderStatus
}

export interface CommodityItemDto {
  _id: string
  name: string
  amount: number
  image: string
  commodityId: string
}

export type OrderStatus = 'unpaid' | 'cancel' | 'shipping' | 'shipped' | 'received'
