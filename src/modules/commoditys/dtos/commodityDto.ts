import { ISkuDto } from './skuDto'

export interface CommodityDto {
  _id: string
  name: string
  amount: number
  description: string
  images: string[]
  fakeAmount: string
  sales: number
  restrictedPurchaseQuantity: number
  limitedPurchasePerPerson: number
  tags: string[]
  imgesDescrptionList: string[]
  type: string
  strategyTags: string[]
  categoryId: string
  skus: ISkuDto[]
}
