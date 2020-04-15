import { UseCase } from '../../../../../shared/core/UseCase'
import { Either, Result, left, right } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { ISignInRepo } from '../../../repos/signInRepo'
import { GetDailySignInCountByUserIdDto } from './getDailySignInCountByUserIdDto'

type Response = Either<AppError.UnexpectedError, Result<number>>

export class GetDailySignInCountByUserIdUseCase implements UseCase<GetDailySignInCountByUserIdDto, Promise<Response>> {
  private signInRepo: ISignInRepo

  constructor(signInRepo: ISignInRepo) {
    this.signInRepo = signInRepo
  }

  public async execute(request: GetDailySignInCountByUserIdDto): Promise<Response> {
    try {
      let { userId } = request
      let count = await this.signInRepo.getCountByUserId(userId)

      return right(Result.ok<number>(count))
    } catch (err) {
      return left(new AppError.UnexpectedError(err.toString()))
    }
  }
}
