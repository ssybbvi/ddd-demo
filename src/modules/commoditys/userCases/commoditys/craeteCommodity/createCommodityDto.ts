export interface CreateCommodityDto {
  name: string
  price: number
  descrption: string
  images: string[]
  fakePrice: string
  sales: number
  restrictedPurchaseQuantity: number
  limitedPurchasePerPerson: number
  tags: string[],
  imgesDescrptionList: string[]
}
