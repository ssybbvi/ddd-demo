import { left, Result, Either, right } from '../../../../../shared/core/Result'
import { UseCase } from '../../../../../shared/core/UseCase'
import { AppError } from '../../../../../shared/core/AppError'
import { GetUpCurrentUserDto } from './getUpCurrentUserDto'
import { IUpUserRepo } from '../../../repos/upUserRepo'
import { UpUser } from '../../../domain/upUser'

type Response = Either<AppError.UnexpectedError, Result<UpUser>>

export class GetUpCurrentUserUseCase implements UseCase<GetUpCurrentUserDto, Promise<Response>> {
  private upUserRepo: IUpUserRepo

  constructor(upUserRepo: IUpUserRepo) {
    this.upUserRepo = upUserRepo
  }

  public async execute(request: GetUpCurrentUserDto): Promise<Response> {
    try {
      const upUser = await this.upUserRepo.getById(request.userId)

      return right(Result.ok<UpUser>(upUser))
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
