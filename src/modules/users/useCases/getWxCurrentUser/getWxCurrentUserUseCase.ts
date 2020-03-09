import { left, Result, Either, right } from '../../../../shared/core/Result'
import { UserName } from '../../domain/userName'
import { IUserRepo } from '../../repos/userRepo'
import { UseCase } from '../../../../shared/core/UseCase'
import { AppError } from '../../../../shared/core/AppError'
import { User } from '../../domain/user'
import { GetWxCurrentUserDto } from './getWxCurrentUserDto'

type Response = Either<AppError.UnexpectedError, Result<User>>

export class GetWxCurrentUserUseCase implements UseCase<GetWxCurrentUserDto, Promise<Response>> {
  private userRepo: IUserRepo

  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo
  }

  public async execute(request: GetWxCurrentUserDto): Promise<Response> {
    try {
      const user = await this.userRepo.getById(request.userId)

      return right(Result.ok<User>(user))
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
