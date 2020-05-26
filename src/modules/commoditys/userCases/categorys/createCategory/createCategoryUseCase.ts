import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { Category } from '../../../domain/category'
import { ICategoryRepo } from '../../../repos/iCategoryRepo'
import { ICreateCategoryDto } from './createCategoryDto'
import { Specification } from '../../../domain/specification'
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID'
import { Attribute } from '../../../domain/attribute'
import { Specifications } from '../../../domain/specifications'
import { Attributes } from '../../../domain/attributes'

type Response = Either<
  AppError.UnexpectedError | Result<Category> | Result<Attribute> | Result<Specification>,
  Result<void>
>

export class CreateCategoryUseCase implements UseCase<ICreateCategoryDto, Promise<Response>> {
  private categoryRepo: ICategoryRepo

  constructor(categoryRepo: ICategoryRepo) {
    this.categoryRepo = categoryRepo
  }

  public async execute(request: ICreateCategoryDto): Promise<Response> {
    try {
      const { name, parentId } = request

      const categoryOrEerros = Category.create({
        name,
        parentId,
        attributes: Attributes.create([]),
      })

      if (categoryOrEerros.isFailure) {
        return left(categoryOrEerros)
      }

      await this.categoryRepo.save(categoryOrEerros.getValue())
      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
