export interface ISkuDto {
  _id: string
  name: string
  code: string
  price: number
  stock: number
  isSufficient: boolean
  combines: ISkuSpecificationDto[]
}

export interface ISkuSpecificationDto {
  attributeId: string
  specificationId: string
}
