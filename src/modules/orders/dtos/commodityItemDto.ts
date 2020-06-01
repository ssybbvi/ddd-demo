export interface ICommodityItemDto {
  _id: string
  name: string
  amount: number
  commodityId: string
  commodityType: string
  skuId: string
  specifications: string
  strategyTags: string[]
}
