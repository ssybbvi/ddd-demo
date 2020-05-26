import { IMapper } from '../../../shared/infra/Mapper'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { Category } from '../domain/category'
import { ICategoryDto } from '../dtos/categoryDto'
import { ICategoryDbModel } from '../dbModels/categoryDbModel'
import { AttributeMap } from './attributeMap'
import { Attributes } from '../domain/attributes'

export class CategoryMap implements IMapper<Category> {
  public static async toDtoList(categoryList: Category[]) {
    const list = []
    for (let item of categoryList) {
      list.push(this.toDTO(item))
    }
    return list
  }

  public static toDTO(category: Category): ICategoryDto {
    const attributes = category.attributes.getItems().map((item) => AttributeMap.toDTO(item))
    return {
      _id: category.id.toString(),
      name: category.name,
      parentId: category.parentId,
      attributes: attributes,
    }
  }

  public static toDomain(raw: ICategoryDbModel): Category {
    if (raw == null) {
      return null
    }

    const attributeList = raw.attributes.map((item) => AttributeMap.toDomain(item))
    const attributes = Attributes.create(attributeList)
    const categoryOrError = Category.create(
      {
        name: raw.name,
        parentId: raw.parentId,
        attributes: attributes,
      },
      new UniqueEntityID(raw._id)
    )

    categoryOrError.isFailure ? console.log(categoryOrError.error) : ''
    return categoryOrError.isSuccess ? categoryOrError.getValue() : null
  }

  public static toPersistence(category: Category): ICategoryDbModel {
    const attributes = category.attributes.getItems().map((item) => AttributeMap.toPersistence(item))
    return {
      _id: category.id.toString(),
      name: category.name,
      parentId: category.parentId,
      attributes: attributes,
    }
  }
}
