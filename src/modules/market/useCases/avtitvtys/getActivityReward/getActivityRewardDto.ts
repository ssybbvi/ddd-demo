export interface IGetActivityRewardDto {
  couponId: string
  strategyCommodityDtoList: IStrategyCommodityDto[]
  userId: string
}

export interface IStrategyCommodityDto {
  commodityId: string
  skuId: string
}
