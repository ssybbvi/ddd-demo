import { IMapper } from '../../../shared/infra/Mapper'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { Category } from '../domain/category'
import { ICategoryDto } from '../dtos/categoryDto'
import { ICategoryDbModel } from '../dbModels/categoryDbModel'

export class CategoryMap implements IMapper<Category> {
  public static async toDtoList(categoryList: Category[]) {
    const list = []
    for (let item of categoryList) {
      list.push(await this.toDTO(item))
    }
    return list
  }

  public static async toDTO(category: Category): Promise<ICategoryDto> {
    return {
      _id: category.id.toString(),
      name: category.name,
      parentId: category.parentId,
    }
  }

  public static toDomain(raw: ICategoryDbModel): Category {
    if (raw == null) {
      return null
    }

    const categoryOrError = Category.create(
      {
        name: raw.name,
        parentId: raw.parentId,
      },
      new UniqueEntityID(raw._id)
    )

    categoryOrError.isFailure ? console.log(categoryOrError.error) : ''
    return categoryOrError.isSuccess ? categoryOrError.getValue() : null
  }

  public static toPersistence(category: Category): ICategoryDbModel {
    return {
      _id: category.id.toString(),
      name: category.name,
      parentId: category.parentId,
    }
  }
}
