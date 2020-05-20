export interface ISkuDbModel {
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
