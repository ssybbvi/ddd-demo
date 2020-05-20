import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { Category } from '../../../domain/category'
import { ICategoryRepo } from '../../../repos/iCategoryRepo'
import { IUpdateCategoryDto } from './updateCategoryDto'

type Response = Either<AppError.UnexpectedError, Result<void>>

export class UpdateCategoryUseCase implements UseCase<IUpdateCategoryDto, Promise<Response>> {
  private categoryRepo: ICategoryRepo

  constructor(categoryRepo: ICategoryRepo) {
    this.categoryRepo = categoryRepo
  }

  public async execute(request: IUpdateCategoryDto): Promise<Response> {
    try {
      const { _id, name, parentId } = request

      const category = await this.categoryRepo.getById(_id)

      category.updateName(name)
      category.updateParentId(parentId)

      await this.categoryRepo.save(category)
      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
