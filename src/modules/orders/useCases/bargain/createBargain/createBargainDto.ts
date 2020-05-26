export interface CreateBargainDto {
  userId: string
  commodityItems: CreateBargainCommodityDto[]

  userName: string
  provinceName: string
  cityName: string
  countyName: string
  detailAddressInfo: string
  nationalCode: string
  telNumber: string
}

export interface CreateBargainCommodityDto {
  commodityId: string
  skuId: string
}
