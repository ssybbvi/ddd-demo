import { UseCase } from '../../../../../shared/core/UseCase'
import { IRecommendedUserRepo } from '../../../repos/recommendedUserRepo'
import { Either, Result, left, right } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { RecommendedUser } from '../../../domain/recommendedUser'
import { GetUserByInviteRecommendedUserIdDto } from './getUserByInviteRecommendedUserIdDto'

type Response = Either<AppError.UnexpectedError | Result<any>, Result<RecommendedUser[]>>

export class GetUserByInviteRecommendedUserIdUseCase implements UseCase<GetUserByInviteRecommendedUserIdDto, Promise<Response>> {
  private recommendedUserRepo: IRecommendedUserRepo

  constructor(recommendedUserRepo: IRecommendedUserRepo) {
    this.recommendedUserRepo = recommendedUserRepo
  }

  //该用户推荐的用户
  public async execute(request: GetUserByInviteRecommendedUserIdDto): Promise<Response> {
    try {
      const { userId } = request
      let recommendedUserList = await this.recommendedUserRepo.getUserByInviteRecommendedUserId(userId)
      return right(Result.ok<RecommendedUser[]>(recommendedUserList))
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
