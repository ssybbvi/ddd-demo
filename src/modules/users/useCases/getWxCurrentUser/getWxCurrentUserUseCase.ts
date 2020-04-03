import { left, Result, Either, right } from '../../../../shared/core/Result'
import { IUserRepo } from '../../repos/userRepo'
import { UseCase } from '../../../../shared/core/UseCase'
import { AppError } from '../../../../shared/core/AppError'
import { User } from '../../domain/user'
import { GetWxCurrentUserDto } from './getWxCurrentUserDto'
import { IWxUserRepo } from '../../repos/wxUserRepo'
import { WxUser } from '../../domain/wxUser'

type Response = Either<AppError.UnexpectedError, Result<WxUser>>

export class GetWxCurrentUserUseCase implements UseCase<GetWxCurrentUserDto, Promise<Response>> {
  private wxUserRepo: IWxUserRepo

  constructor(wxUserRepo: IWxUserRepo) {
    this.wxUserRepo = wxUserRepo
  }

  public async execute(request: GetWxCurrentUserDto): Promise<Response> {
    try {
      const wxUser = await this.wxUserRepo.getById(request.userId)

      return right(Result.ok<WxUser>(wxUser))
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
