import { ISkuDto } from './skuDto'
import { IAttributeDto } from './attributeDto'

export interface CommodityDto {
  _id: string
  name: string
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
  attributes: IAttributeDto[]
}
