import { UseCase } from '../../../../shared/core/UseCase'
import { Either, Result, left, right } from '../../../../shared/core/Result'
import { AppError } from '../../../../shared/core/AppError'
import { GetUserByInviteRecommendedUserIdDto } from './getUserByInviteRecommendedUserIdDto'
import { IUserRepo } from '../../repos/userRepo'
import { User } from '../../domain/user'

type Response = Either<AppError.UnexpectedError | Result<any>, Result<User[]>>

export class GetUserByInviteRecommendedUserIdUseCase
  implements UseCase<GetUserByInviteRecommendedUserIdDto, Promise<Response>> {
  private userRepo: IUserRepo

  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo
  }

  //该用户推荐的用户
  public async execute(request: GetUserByInviteRecommendedUserIdDto): Promise<Response> {
    try {
      const { userId } = request
      let userList = await this.userRepo.getUserByInviteRecommendedUserId(userId)
      return right(Result.ok<User[]>(userList))
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
