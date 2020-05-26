import { IBaseIdDbModels } from '../../../shared/infra/database/dbModel/baseIdDbModels'
import { ITenantIdDbModel } from '../../../shared/infra/database/dbModel/tenantIdDbModel'
import { ISkuDbModel } from './skuDbModel'
import { IAttributeDbModel } from './attributeDbModel'

export interface ICommodityDbModel extends IBaseIdDbModels, ITenantIdDbModel {
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
  skus: ISkuDbModel[]
  attributes: IAttributeDbModel[]
}
