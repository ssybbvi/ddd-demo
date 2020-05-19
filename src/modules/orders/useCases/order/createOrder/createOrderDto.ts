export interface CreateOrderDto {
  userId: string
  remark?: string

  userName: string
  provinceName: string
  cityName: string
  countyName: string
  detailAddressInfo: string
  nationalCode: string
  telNumber: string

  couponId?: string

  commodityItems: CreateCommodityItemDto[]
}

export interface CreateCommodityItemDto {
  commodityId: string
}
