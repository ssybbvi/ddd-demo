import { ISkuDto } from '../../../dtos/skuDto'
import { IAttributeDto } from '../../../dtos/attributeDto'

export interface CreateCommodityDto {
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
