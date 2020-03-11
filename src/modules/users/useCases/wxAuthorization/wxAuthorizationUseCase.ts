import { AppError } from '../../../../shared/core/AppError'
import { Either, Result, left, right } from '../../../../shared/core/Result'
import { UseCase } from '../../../../shared/core/UseCase'
import { IUserRepo } from '../../repos/userRepo'
import { IAuthService } from '../../services/authService'
import { User } from '../../domain/user'
import { UserName } from '../../domain/userName'
import { UserPassword } from '../../domain/userPassword'
import { JWTToken, RefreshToken } from '../../domain/jwt'
import { AuthorizationService } from '../../services/authorizationService'
import { WxAuthorizationDto } from './wxAuthorizationDto'
import { WxAuthrizationService, WxJsCodeToSessionResult } from '../../services/wxAuthrizationService'
import { WxAuthorizationErrors } from './wxAuthorizationErrors'
import { WxUser } from '../../domain/wxUser'
import { WxAuthorizationDtoResult } from './wxAuthorizationDtoResult'

type Response = Either<
  WxAuthorizationErrors.WxJsCodeToSessionError | AppError.UnexpectedError | Result<any>,
  Result<WxAuthorizationDtoResult>
>

export class WxAuthorizationUseCase implements UseCase<WxAuthorizationDto, Promise<Response>> {
  private userRepo: IUserRepo
  private authorizationService: AuthorizationService
  private wxAuthrizationService: WxAuthrizationService

  constructor(
    userRepo: IUserRepo,
    authorizationService: AuthorizationService,
    wxAuthrizationService: WxAuthrizationService
  ) {
    this.userRepo = userRepo
    this.authorizationService = authorizationService
    this.wxAuthrizationService = wxAuthrizationService
  }

  public async execute(request: WxAuthorizationDto): Promise<Response> {
    try {
      let jsCodeToSessionResult = await this.wxAuthrizationService.jsCodeToSession(request.code)
      let jsCodeToSessionValue = jsCodeToSessionResult.value
      if (jsCodeToSessionResult.isLeft()) {
        return left(jsCodeToSessionValue)
      }

      let wxJsCodeToSessionResult: WxJsCodeToSessionResult = jsCodeToSessionValue.getValue()
      const isExist = await this.userRepo.existsWxOpenId(wxJsCodeToSessionResult.openid)

      if (!isExist) {
        const wxUserOrError = WxUser.create({
          openId: wxJsCodeToSessionResult.openid,
          unionId: wxJsCodeToSessionResult.unionid,
          sessionKey: wxJsCodeToSessionResult.session_key,
          nickName: request.nickName,
          avatarUrl: request.avatarUrl,
          gender: request.gender
        })

        if (wxUserOrError.isFailure) {
          return left(Result.fail<User>(wxUserOrError.error.toString())) as Response
        }

        let userOrError = User.create(
          {
            platform: {
              wx: wxUserOrError.getValue()
            }
          },
          null,
          {
            inviteToken: request.inviteToken
          }
        )

        if (userOrError.isFailure) {
          return left(Result.fail<User>(userOrError.error.toString())) as Response
        }

        await this.userRepo.save(userOrError.getValue())
      }

      let user = await this.userRepo.getUserByWxOpenId(wxJsCodeToSessionResult.openid)
      let loginDTOResponse: WxAuthorizationDtoResult = await this.authorizationService.getAceessTokenWithRefreshToken(
        user
      )
      await this.userRepo.save(user)

      return right(Result.ok<WxAuthorizationDtoResult>(loginDTOResponse))
    } catch (err) {
      return left(new AppError.UnexpectedError(err.toString()))
    }
  }
}
