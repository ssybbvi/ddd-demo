export interface CreateCommodityDto {
  name: string
  amount: number
  description: string
  images: string[]
  fakeAmount: string
  sales: number
  restrictedPurchaseQuantity: number
  limitedPurchasePerPerson: number
  tags: string[],
  imgesDescrptionList: string[],
  type: string
}
