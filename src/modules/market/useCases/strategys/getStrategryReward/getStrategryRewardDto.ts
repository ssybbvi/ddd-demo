export interface IGetStrategryRewardDto {
  couponId: string
  strategyCommodityDtoList: IStrategyCommodityDto[]
  userId: string
}

export interface IStrategyCommodityDto {
  commodityId: string
  skuId: string
}
