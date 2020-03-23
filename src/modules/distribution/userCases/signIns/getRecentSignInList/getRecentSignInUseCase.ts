import { UseCase } from '../../../../../shared/core/UseCase'
import { Either, Result, left, right } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { ISignInRepo } from '../../../repos/signInRepo'
import { GetRecentSignInDto } from './getRecentSignInDto'
import { SignInService } from '../../../domain/services/signInService'
import { GetRecentSignInDtoResult } from './getRecentSignInDtoResult'

type Response = Either<AppError.UnexpectedError | Result<any>, Result<GetRecentSignInDtoResult>>

export class GetRecentSignInUseCase implements UseCase<GetRecentSignInDto, Promise<Response>> {
  private signInRepo: ISignInRepo
  private signInService: SignInService
  private day = 5

  constructor(signInRepo: ISignInRepo, signInService: SignInService) {
    this.signInRepo = signInRepo
    this.signInService = signInService
  }

  public async execute(request: GetRecentSignInDto): Promise<Response> {
    try {
      let { userId } = request
      let list = await this.signInRepo.filter(userId, this.day)
      let continuousSignInDayCount = this.signInService.getContinuousSignInDayCount(list)

      return right(
        Result.ok<GetRecentSignInDtoResult>({
          continuousSignInDayCount,
          isAllowSuperSignIn: this.day === continuousSignInDayCount
        })
      )
    } catch (err) {
      return left(new AppError.UnexpectedError(err.toString()))
    }
  }
}
