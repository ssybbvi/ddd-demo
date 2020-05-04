import { AppError } from '../../../../../shared/core/AppError'
import { Either, Result, left, right } from '../../../../../shared/core/Result'
import { UseCase } from '../../../../../shared/core/UseCase'
import { IUserRepo } from '../../../repos/userRepo'
import { User } from '../../../domain/user'
import { CreateUserDto } from './createUserDto'
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID'

type Response = Either<Result<User> | AppError.UnexpectedError, Result<void>>

export class CraeteUseCase implements UseCase<CreateUserDto, Promise<Response>> {
  private userRepo: IUserRepo

  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo
  }

  public async execute(request: CreateUserDto): Promise<Response> {
    try {
      const { _id } = request

      const userOrError = User.create({}, new UniqueEntityID(_id), true)

      if (userOrError.isFailure) {
        return left(Result.fail<User>(userOrError.error.toString())) as Response
      }
      let user = userOrError.getValue()
      await this.userRepo.save(user)

      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err.toString()))
    }
  }
}
