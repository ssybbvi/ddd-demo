import { ICancelInfoDto } from './cancelInfoDto'
import { IPaymentInfoDto } from './paymentInfoDto'
import { IDeliveryInfoDto, IAddressInfoDto } from './deliveryInfoDto'
import { ICommodityItemDto } from './commodityItemDto'

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
  commodityItems: ICommodityItemDto[]

  status: OrderStatus
}

export type OrderStatus = 'unpaid' | 'cancel' | 'shipping' | 'shipped' | 'received'
