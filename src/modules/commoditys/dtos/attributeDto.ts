import { ISpecificationDto } from './specificationDto'

export interface IAttributeDto {
  _id: string
  name: string
  specifications: ISpecificationDto[]
}
