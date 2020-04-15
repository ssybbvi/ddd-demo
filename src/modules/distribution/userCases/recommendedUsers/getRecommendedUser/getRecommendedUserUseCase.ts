import { UseCase } from '../../../../../shared/core/UseCase'
import { IRecommendedUserRepo } from '../../../repos/recommendedUserRepo'
import { Either, Result, left, right } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { GetRecommendedUserDto } from './getRecommendedUserDto'
import { RecommendedUser } from '../../../domain/recommendedUser'

type Response = Either<AppError.UnexpectedError, Result<RecommendedUser>>

export class GetRecommendedUserUseCase implements UseCase<GetRecommendedUserDto, Promise<Response>> {
  private recommendedUserRepo: IRecommendedUserRepo

  constructor(recommendedUserRepo: IRecommendedUserRepo) {
    this.recommendedUserRepo = recommendedUserRepo
  }

  public async execute(request: GetRecommendedUserDto): Promise<Response> {
    try {
      const { recommendedUserId } = request
      let recommendedUser = await this.recommendedUserRepo.getById(recommendedUserId)
      return right(Result.ok<RecommendedUser>(recommendedUser))
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
