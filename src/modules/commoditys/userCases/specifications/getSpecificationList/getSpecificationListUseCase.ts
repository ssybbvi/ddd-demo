import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { Specification } from '../../../domain/specification'
import { ISpecificationRepo } from '../../../repos/iSpecificationRepo'
import { IGetSpecificationListDto } from './getSpecificationListDto'

type Response = Either<AppError.UnexpectedError, Result<Specification[]>>

export class GetSpecificationListUseCase implements UseCase<IGetSpecificationListDto, Promise<Response>> {
  private specificationRepo: ISpecificationRepo

  constructor(specificationRepo: ISpecificationRepo) {
    this.specificationRepo = specificationRepo
  }

  public async execute(request: IGetSpecificationListDto): Promise<Response> {
    try {
      const list = await this.specificationRepo.filter()
      return right(Result.ok<Specification[]>(list))
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
