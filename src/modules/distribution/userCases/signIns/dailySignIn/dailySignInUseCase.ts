import { UseCase } from '../../../../../shared/core/UseCase'
import { Either, Result, left, right } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { DailySignInErrors } from './dailySignInErrors'
import { DailySignInDto } from './dailySignInDto'
import { ISignInRepo } from '../../../repos/signInRepo'
import { SignIn } from '../../../domain/signIn'
import { DailySignInDtoResult } from './dailySignInDtoResult'
import { SharedRewardToInvitedMemberService } from '../../../domain/services/sharedRewardToInvitedMemberService'

type Response = Either<
  DailySignInErrors.TodayAlreadySignInError | AppError.UnexpectedError | Result<any>,
  Result<DailySignInDtoResult>
>

export class DailySignInUseCase implements UseCase<DailySignInDto, Promise<Response>> {
  private signInRepo: ISignInRepo
  private sharedRewardToInvitedMemberService: SharedRewardToInvitedMemberService

  constructor(signInRepo: ISignInRepo, sharedRewardToInvitedMemberService: SharedRewardToInvitedMemberService) {
    this.signInRepo = signInRepo
    this.sharedRewardToInvitedMemberService = sharedRewardToInvitedMemberService
  }

  public async execute(request: DailySignInDto): Promise<Response> {
    try {
      let reward = 10
      const signInOrError = SignIn.create({
        signInMemberId: request.signInMemberId,
        createAt: 0,
        reward: reward
      })

      if (signInOrError.isFailure) {
        return left(signInOrError)
      }

      await this.signInRepo.save(signInOrError.getValue())
      await this.sharedRewardToInvitedMemberService.rewardSignIn(signInOrError.getValue())

      return right(
        Result.ok<DailySignInDtoResult>({
          reward: reward
        })
      )
    } catch (err) {
      return left(new AppError.UnexpectedError(err.toString()))
    }
  }
}