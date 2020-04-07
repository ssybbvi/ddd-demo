import { AppError } from '../../../../../shared/core/AppError'
import { Either, Result, left, right } from '../../../../../shared/core/Result'
import { UseCase } from '../../../../../shared/core/UseCase'
import { IWxUserRepo } from '../../../repos/wxUserRepo'
import { RefreshSessionKeyDto } from './refreshSessionKeyDto'

type Response = Either<AppError.UnexpectedError | Result<any>, Result<void>>

export class RefreshSessionKeyUseCase implements UseCase<RefreshSessionKeyDto, Promise<Response>> {
  private wxUserRepo: IWxUserRepo

  constructor(wxUserRepo: IWxUserRepo) {
    this.wxUserRepo = wxUserRepo
  }

  public async execute(request: RefreshSessionKeyDto): Promise<Response> {
    try {
      const { userId, sessionKey } = request

      const wxUser = await this.wxUserRepo.getById(userId)
      wxUser.refreshSessionKey(sessionKey)

      await this.wxUserRepo.save(wxUser)
      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err.toString()))
    }
  }
}
