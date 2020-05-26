import { IAttributeDto } from '../../../dtos/attributeDto'

export interface IUpdateCategoryDto {
  _id: string
  name: string
  parentId: string
  attributes: IAttributeDto[]
}
