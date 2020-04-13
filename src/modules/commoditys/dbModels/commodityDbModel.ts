export interface ICommodityDbModel {
  _id: string
  name: string
  price: number
  descrption: string
  images: string[]
  fakePrice: string
  sales: number
  restrictedPurchaseQuantity: number
  limitedPurchasePerPerson: number
  tags: string[]
  imgesDescrptionList: string[],
  type: string
}
