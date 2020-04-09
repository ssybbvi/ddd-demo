import { AppError } from '../../../../../shared/core/AppError'
import { Either, Result, left, right } from '../../../../../shared/core/Result'
import { UseCase } from '../../../../../shared/core/UseCase'
import { IUserRepo } from '../../../repos/userRepo'
import { RecommendedByInviteTokenDto } from './recommendedByInviteTokenDto'
import { RecommendedByInviteTokenErrors } from './recommendedByInviteTokenErrors'

type Response = Either<
  AppError.UnexpectedError | RecommendedByInviteTokenErrors.InviteTokenInValidError
  | RecommendedByInviteTokenErrors.DontRecommendMyself
  | Result<any>,
  Result<void>
>

export class RecommendedByInviteTokenUseCase implements UseCase<RecommendedByInviteTokenDto, Promise<Response>> {
  private userRepo: IUserRepo

  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo
  }

  public async execute(request: RecommendedByInviteTokenDto): Promise<Response> {
    try {
      const { userId, inviteToken } = request
      const inviteRecommendedUser = await this.userRepo.getUserByInviteToken(inviteToken)
      if (!inviteRecommendedUser) {
        return left(new RecommendedByInviteTokenErrors.InviteTokenInValidError())
      }

      if (inviteRecommendedUser.id.toString() === userId) {
        return left(new RecommendedByInviteTokenErrors.DontRecommendMyself())
      }

      const user = await this.userRepo.getById(userId)
      if (user.inviteRecommendedUserId) {
        return left(new RecommendedByInviteTokenErrors.DontRepeatRecommend())
      }

      user.setInviteRecommendedUserId(inviteRecommendedUser.id.toString())
      await this.userRepo.save(user)

      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err.toString()))
    }
  }
}
