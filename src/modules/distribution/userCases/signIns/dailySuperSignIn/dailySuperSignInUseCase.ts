import { UseCase } from '../../../../../shared/core/UseCase'
import { Either, Result, left, right } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { ISignInRepo } from '../../../repos/signInRepo'
import { SignIn } from '../../../domain/signIn'
import { SignInCreated } from '../../../domain/events/signInCreated'
import { SignInDTO } from '../../../dtos/signInDTO'
import { DailySuperSignInDto } from './dailySuperSignInDto'
import { DailySuperSignInErrors } from './dailySuperSignInErrors'
import { DailySuperSignInDtoResult } from './dailySuperSignInDtoResult'
import { SignInService } from '../../../domain/services/signInService'

type Response = Either<
  DailySuperSignInErrors.NonCompliantErrors | AppError.UnexpectedError | Result<any>,
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
      let { memberId } = request
      let list = await this.signInRepo.filter(memberId, this.day)

      let continuousSignInDayCount = this.signInService.getContinuousSignInDayCount(list)
      if (continuousSignInDayCount) {
      } else {
        return left(
          new DailySuperSignInErrors.NonCompliantErrors(`需要连续打卡${this.day},实际${continuousSignInDayCount}`)
        )
      }

      let signIn = await this.signInRepo.getToday(memberId)

      let reward = this.getRewared()
      signIn.updateSuperReward(reward)
      this.signInRepo.save(signIn)

      return right(
        Result.ok<DailySuperSignInDtoResult>({ reward })
      )
    } catch (err) {
      return left(new AppError.UnexpectedError(err.toString()))
    }
  }

  private getRewared(): number {
    let maxNum = 20
    let minNum = 50

    var result = Math.random() * (maxNum + 1 - minNum) + minNum
    while (result > maxNum) {
      result = Math.random() * (maxNum + 1 - minNum) + minNum
    }
    return result
  }
}
