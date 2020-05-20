import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { Category } from '../../../domain/category'
import { ICategoryRepo } from '../../../repos/iCategoryRepo'
import { ICreateCategoryDto } from './createCategoryDto'

type Response = Either<AppError.UnexpectedError | Result<Category>, Result<void>>

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
