import { IAttributeDto } from './attributeDto'

export interface ICategoryDto {
  _id: string
  name: string
  parentId: string
  attributes: IAttributeDto[]
}
