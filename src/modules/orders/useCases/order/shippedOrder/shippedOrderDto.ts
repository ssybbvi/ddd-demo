import { DeliveryInfoType } from '../../../domain/deliveryInfoType'

export interface ShippedOrderDto {
  orderId: string
  shippedNumber: string
  shippedType: DeliveryInfoType
}
