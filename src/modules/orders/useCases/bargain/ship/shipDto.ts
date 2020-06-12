import { DeliveryInfoType } from '../../../domain/deliveryInfoType'

export interface ShipDto {
  _id: string
  code: string
  type: DeliveryInfoType
}
