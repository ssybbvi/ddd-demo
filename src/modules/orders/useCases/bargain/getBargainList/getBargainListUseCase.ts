import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { Bargain } from '../../../domain/bargain'
import { IBargainRepo } from '../../../repos/bargainRepo'
import { GetBargainListDto } from './getBargainListDto'


type Response = Either<AppError.UnexpectedError, Result<Bargain[]>>


export class GetBargainListUseCase implements UseCase<GetBargainListDto, Promise<Response>> {
  private bargainRepo: IBargainRepo

  constructor(
    bargainRepo: IBargainRepo) {
    this.bargainRepo = bargainRepo
  }


  public async execute(request: GetBargainListDto): Promise<Response> {
    try {
      const { } = request
      const bargainList = await this.bargainRepo.filter()
      return right(Result.ok<Bargain[]>(bargainList))
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
