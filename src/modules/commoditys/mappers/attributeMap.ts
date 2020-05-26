import { IMapper } from '../../../shared/infra/Mapper'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { Attribute } from '../domain/attribute'
import { IAttributeDto } from '../dtos/attributeDto'
import { IAttributeDbModel } from '../dbModels/attributeDbModel'
import { SpecificationMap } from './specificationMap'
import { Specifications } from '../domain/specifications'

export class AttributeMap implements IMapper<Attribute> {
  public static toDtoList(attributeList: Attribute[]): IAttributeDto[] {
    const list = []
    for (let item of attributeList) {
      list.push(this.toDTO(item))
    }
    return list
  }

  public static toDTO(attribute: Attribute): IAttributeDto {
    return {
      _id: attribute.id.toString(),
      name: attribute.name,
      specifications: SpecificationMap.toDtoList(attribute.specifications.getItems()),
    }
  }

  public static toDomain(raw: IAttributeDbModel): Attribute {
    if (raw == null) {
      return null
    }

    const specificationList = raw.specifications.map((item) => SpecificationMap.toDomain(item))
    const specifications = Specifications.create(specificationList)

    const attributeOrError = Attribute.create(
      {
        name: raw.name,
        specifications: specifications,
      },
      new UniqueEntityID(raw._id)
    )

    attributeOrError.isFailure ? console.log(attributeOrError.error) : ''
    return attributeOrError.isSuccess ? attributeOrError.getValue() : null
  }

  public static toPersistence(attribute: Attribute): IAttributeDbModel {
    const specifications = attribute.specifications.getItems().map((item) => SpecificationMap.toPersistence(item))
    return {
      _id: attribute.id.toString(),
      name: attribute.name,
      specifications: specifications,
    }
  }
}
