import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { Category } from '../../../domain/category'
import { ICategoryRepo } from '../../../repos/iCategoryRepo'
import { IGetCategoryListDto } from './getCategoryListDto'

type Response = Either<AppError.UnexpectedError, Result<Category[]>>

export class GetCategoryListUseCase implements UseCase<IGetCategoryListDto, Promise<Response>> {
  private categoryRepo: ICategoryRepo

  constructor(categoryRepo: ICategoryRepo) {
    this.categoryRepo = categoryRepo
  }

  public async execute(request: IGetCategoryListDto): Promise<Response> {
    try {
      const list = await this.categoryRepo.filter()
      return right(Result.ok<Category[]>(list))
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
