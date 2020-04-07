import { AppError } from '../../../../../shared/core/AppError'
import { Either, Result, left, right } from '../../../../../shared/core/Result'
import { UseCase } from '../../../../../shared/core/UseCase'
import { User } from '../../../domain/user'
import { WxUser } from '../../../domain/wxUser'
import { IWxUserRepo } from '../../../repos/wxUserRepo'
import { CreateWxUserErrors } from './createWxUserErrors'
import { CreateWxUserDto } from './createWxUserDto'

type Response = Either<
  | CreateWxUserErrors.WxJsCodeToSessionError
  | CreateWxUserErrors.OpenIdAlreadyExist
  | AppError.UnexpectedError
  | Result<any>,
  Result<void>
>

export class CreateWxUserUseCase implements UseCase<CreateWxUserDto, Promise<Response>> {
  private wxUserRepo: IWxUserRepo

  constructor(wxUserRepo: IWxUserRepo) {
    this.wxUserRepo = wxUserRepo
  }

  public async execute(request: CreateWxUserDto): Promise<Response> {
    try {
      const { openId, unionId, sessionKey, nickName, avatarUrl, gender } = request

      const isExist = await this.wxUserRepo.existsWxOpenId(openId)
      if (isExist) {
        return left(new CreateWxUserErrors.OpenIdAlreadyExist())
      }

      const wxUserOrError = WxUser.create({
        openId: openId,
        unionId: unionId,
        sessionKey: sessionKey,
        nickName: nickName,
        avatarUrl: avatarUrl,
        gender: gender
      })

      if (wxUserOrError.isFailure) {
        return left(Result.fail<User>(wxUserOrError.error.toString())) as Response
      }

      await this.wxUserRepo.save(wxUserOrError.getValue())

      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err.toString()))
    }
  }
}
