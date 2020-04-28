import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { Bargain } from '../../../domain/bargain'
import { IBargainRepo } from '../../../repos/bargainRepo'
import { GetBargainDto } from './getBargainDto'


type Response = Either<AppError.UnexpectedError, Result<Bargain>>


export class GetBargainUseCase implements UseCase<GetBargainDto, Promise<Response>> {
  private bargainRepo: IBargainRepo

  constructor(
    bargainRepo: IBargainRepo) {
    this.bargainRepo = bargainRepo
  }


  public async execute(request: GetBargainDto): Promise<Response> {
    try {
      const { bargainId } = request
      const bargain = await this.bargainRepo.getById(bargainId)
      return right(Result.ok<Bargain>(bargain))
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
