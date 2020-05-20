import { IMapper } from '../../../shared/infra/Mapper'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { Attribute } from '../domain/attribute'
import { IAttributeDto } from '../dtos/attributeDto'
import { IAttributeDbModel } from '../dbModels/attributeDbModel'

export class AttributeMap implements IMapper<Attribute> {
  public static async toDtoList(attributeList: Attribute[]): Promise<IAttributeDto[]> {
    const list = []
    for (let item of attributeList) {
      list.push(await this.toDTO(item))
    }
    return list
  }

  public static async toDTO(attribute: Attribute): Promise<IAttributeDto> {
    return {
      _id: attribute.id.toString(),
      name: attribute.name,
      categoryId: attribute.categoryId,
    }
  }

  public static toDomain(raw: IAttributeDbModel): Attribute {
    if (raw == null) {
      return null
    }

    const attributeOrError = Attribute.create(
      {
        name: raw.name,
        categoryId: raw.categoryId,
      },
      new UniqueEntityID(raw._id)
    )

    attributeOrError.isFailure ? console.log(attributeOrError.error) : ''
    return attributeOrError.isSuccess ? attributeOrError.getValue() : null
  }

  public static toPersistence(attribute: Attribute): IAttributeDbModel {
    return {
      _id: attribute.id.toString(),
      name: attribute.name,
      categoryId: attribute.categoryId,
    }
  }
}
