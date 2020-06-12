import { DeliveryInfoType } from '../../../domain/deliveryInfoType'

export interface CreateOrderDto {
  userId: string
  remark?: string

  deliveryInfoType: DeliveryInfoType

  couponId?: string
  deliveryType: DeliveryInfoType
  commodityItemDtoList: CreateCommodityItemDto[]
}

export interface CreateCommodityItemDto {
  commodityId: string
  skuId: string
}
