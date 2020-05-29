import { IBaseIdDbModels } from '../../../shared/infra/database/dbModel/baseIdDbModels'

export interface ISkuDbModel extends IBaseIdDbModels {
  name: string
  code: string
  price: number
  stock: number
  isSufficient: boolean
  combines: ISkuSpecificationDbModel[]
}

export interface ISkuSpecificationDbModel {
  attributeId: string
  specificationId: string
}
