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

type Response = Either<
  DailySuperSignInErrors.NonCompliantErrors | AppError.UnexpectedError | Result<any>,
  Result<DailySuperSignInDtoResult>
>

export class DailySuperSignInUseCase implements UseCase<DailySuperSignInDto, Promise<Response>> {
  private signInRepo: ISignInRepo
  private day = 5

  constructor(signInRepo: ISignInRepo) {
    this.signInRepo = signInRepo
  }

  public async execute(request: DailySuperSignInDto): Promise<Response> {
    try {
      let { memberId } = request
      let list = await this.signInRepo.filter(memberId, this.day)
      if (list.length === 0) {
        return left(new DailySuperSignInErrors.NonCompliantErrors(`最近${this.day}都没打卡`))
      }

      if (list.some(item => item.superReward > 0)) {
        return left(new DailySuperSignInErrors.NonCompliantErrors(`最近${this.day}已领取超级礼包`))
      }

      let dayToMillisecond = 1000 * 60 * 60 * 24
      let todayOfMillisecond = new Date().setHours(0, 0, 0, 0)
      let firstDayBegin = todayOfMillisecond - dayToMillisecond * (this.day - 1)
      let firstDayFinish = todayOfMillisecond - dayToMillisecond * (this.day - 2)

      let firstDaySignIn = list[list.length - 1]
      if (firstDayBegin < firstDaySignIn.createAt && firstDaySignIn.createAt < firstDayFinish) {
      } else {
        return left(new DailySuperSignInErrors.NonCompliantErrors(`不满足要求无法打卡`))
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
