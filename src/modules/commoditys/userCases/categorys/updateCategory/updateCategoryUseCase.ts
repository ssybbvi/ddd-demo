import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { ICategoryRepo } from '../../../repos/iCategoryRepo'
import { IUpdateCategoryDto } from './updateCategoryDto'
import { Specification } from '../../../domain/specification'
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID'
import { Attribute } from '../../../domain/attribute'
import { Specifications } from '../../../domain/specifications'
import { Attributes } from '../../../domain/attributes'

type Response = Either<AppError.UnexpectedError | Result<Attribute> | Result<Specification>, Result<void>>

export class UpdateCategoryUseCase implements UseCase<IUpdateCategoryDto, Promise<Response>> {
  private categoryRepo: ICategoryRepo

  constructor(categoryRepo: ICategoryRepo) {
    this.categoryRepo = categoryRepo
  }

  public async execute(request: IUpdateCategoryDto): Promise<Response> {
    try {
      const { _id, name, parentId, attributes } = request

      const attributeList = []
      for (let attribute of attributes) {
        const specificationList = []
        for (let specification of attribute.specifications) {
          const specificationOrError = Specification.create(
            {
              name: specification.name,
              icon: specification.icon,
            },
            new UniqueEntityID(specification._id)
          )

          if (specificationOrError.isFailure) {
            return left(specificationOrError)
          }
          specificationList.push(specificationOrError.getValue())
        }

        const attributeOrError = Attribute.create(
          {
            name: attribute.name,
            specifications: Specifications.create(specificationList),
          },
          new UniqueEntityID(attribute._id)
        )
        if (attributeOrError.isFailure) {
          return left(attributeOrError)
        }
        attributeList.push(attributeOrError.getValue())
      }

      const category = await this.categoryRepo.getById(_id)

      category.updateName(name)
      category.updateParentId(parentId)
      category.updateAttributes(Attributes.create(attributeList))

      await this.categoryRepo.save(category)
      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
