import { AppError } from '../../../../../shared/core/AppError'
import { Either, Result, left, right } from '../../../../../shared/core/Result'
import { UseCase } from '../../../../../shared/core/UseCase'
import { IWxUserRepo } from '../../../repos/wxUserRepo'
import { BindindUseInfoDto } from './bindindUseInfoDto'

type Response = Either<AppError.UnexpectedError | Result<any>, Result<void>>

export class BindindUseInfoUseCase implements UseCase<BindindUseInfoDto, Promise<Response>> {
  private wxUserRepo: IWxUserRepo

  constructor(wxUserRepo: IWxUserRepo) {
    this.wxUserRepo = wxUserRepo
  }

  public async execute(request: BindindUseInfoDto): Promise<Response> {
    try {
      const { userId, nickName, avatarUrl, gender } = request

      const wxUser = await this.wxUserRepo.getById(userId)

      wxUser.bindindUserInfo(nickName, avatarUrl, gender)
      await this.wxUserRepo.save(wxUser)
      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err.toString()))
    }
  }
}
