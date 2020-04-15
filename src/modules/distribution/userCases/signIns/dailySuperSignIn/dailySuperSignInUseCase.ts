import { UseCase } from '../../../../../shared/core/UseCase'
import { Either, Result, left, right } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { ISignInRepo } from '../../../repos/signInRepo'
import { DailySuperSignInDto } from './dailySuperSignInDto'
import { DailySuperSignInErrors } from './dailySuperSignInErrors'
import { DailySuperSignInDtoResult } from './dailySuperSignInDtoResult'
import { SignInService } from '../../../domain/services/signInService'
import { RandomUtils } from '../../../../../shared/utils/RandomUtils'

type Response = Either<
  DailySuperSignInErrors.NonCompliantErrors | AppError.UnexpectedError,
  Result<DailySuperSignInDtoResult>
>

export class DailySuperSignInUseCase implements UseCase<DailySuperSignInDto, Promise<Response>> {
  private signInRepo: ISignInRepo
  private signInService: SignInService
  private day = 5

  constructor(signInRepo: ISignInRepo, signInService: SignInService) {
    this.signInRepo = signInRepo
    this.signInService = signInService
  }

  public async execute(request: DailySuperSignInDto): Promise<Response> {
    try {
      let { userId } = request
      let list = await this.signInRepo.filter(userId, this.day)

      let continuousSignInDayCount = this.signInService.getContinuousSignInDayCount(list)
      if (continuousSignInDayCount) {
      } else {
        return left(
          new DailySuperSignInErrors.NonCompliantErrors(`需要连续打卡${this.day},实际${continuousSignInDayCount}`)
        )
      }

      let signIn = await this.signInRepo.getToday(userId)

      let reward = RandomUtils.interval(4, 10) * 10
      signIn.updateSuperReward(reward)
      await this.signInRepo.save(signIn)

      return right(
        Result.ok<DailySuperSignInDtoResult>({ reward })
      )
    } catch (err) {
      return left(new AppError.UnexpectedError(err.toString()))
    }
  }
}
