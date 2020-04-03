import { AppError } from '../../../../shared/core/AppError'
import { Either, Result, left, right } from '../../../../shared/core/Result'
import { UseCase } from '../../../../shared/core/UseCase'
import { IUserRepo } from '../../repos/userRepo'
import { User } from '../../domain/user'
import { AuthorizationService } from '../../services/authorizationService'
import { WxAuthorizationDto } from './wxAuthorizationDto'
import { WxAuthrizationService, WxJsCodeToSessionResult } from '../../services/wxAuthrizationService'
import { WxAuthorizationErrors } from './wxAuthorizationErrors'
import { WxUser } from '../../domain/wxUser'
import { WxAuthorizationDtoResult } from './wxAuthorizationDtoResult'
import { IWxUserRepo } from '../../repos/wxUserRepo'

type Response = Either<
  | WxAuthorizationErrors.WxJsCodeToSessionError
  | WxAuthorizationErrors.LoginForbidInviteTokenError
  | WxAuthorizationErrors.InviteTokenInValidError
  | AppError.UnexpectedError
  | Result<any>,
  Result<WxAuthorizationDtoResult>
>

export class WxAuthorizationUseCase implements UseCase<WxAuthorizationDto, Promise<Response>> {
  private userRepo: IUserRepo
  private wxUserRepo: IWxUserRepo
  private authorizationService: AuthorizationService
  private wxAuthrizationService: WxAuthrizationService

  constructor(
    userRepo: IUserRepo,
    wxUserRepo: IWxUserRepo,
    authorizationService: AuthorizationService,
    wxAuthrizationService: WxAuthrizationService
  ) {
    this.userRepo = userRepo
    this.wxUserRepo = wxUserRepo
    this.authorizationService = authorizationService
    this.wxAuthrizationService = wxAuthrizationService
  }

  public async execute(request: WxAuthorizationDto): Promise<Response> {
    try {
      const { code, inviteToken, nickName, avatarUrl, gender } = request

      let jsCodeToSessionResult = await this.wxAuthrizationService.jsCodeToSession(code)
      let jsCodeToSessionValue = jsCodeToSessionResult.value
      if (jsCodeToSessionResult.isLeft()) {
        return left(jsCodeToSessionValue)
      }

      let wxJsCodeToSessionResult: WxJsCodeToSessionResult = jsCodeToSessionValue.getValue()
      const isExist = await this.wxUserRepo.existsWxOpenId(wxJsCodeToSessionResult.openid)

      if (!isExist) {
        if (request.inviteToken) {
          const inviteRecommendedUser = await this.userRepo.getUserByUserId(request.inviteToken)
          if (!inviteRecommendedUser) {
            return left(new WxAuthorizationErrors.InviteTokenInValidError())
          }
        }

        const wxUserOrError = WxUser.create({
          openId: wxJsCodeToSessionResult.openid,
          unionId: wxJsCodeToSessionResult.unionid,
          sessionKey: wxJsCodeToSessionResult.session_key,
          nickName: nickName,
          avatarUrl: avatarUrl,
          gender: gender
        })

        if (wxUserOrError.isFailure) {
          return left(Result.fail<User>(wxUserOrError.error.toString())) as Response
        }

        await this.wxUserRepo.save(wxUserOrError.getValue())

        const userOrError = User.create(
          {
            inviteRecommendedUserId: request.inviteToken
          },
          wxUserOrError.getValue().id,
          true
        )

        if (userOrError.isFailure) {
          return left(Result.fail<User>(userOrError.error.toString())) as Response
        }
        let user = userOrError.getValue()
        await this.userRepo.save(user)
      } else {
        if (inviteToken) {
          return left(new WxAuthorizationErrors.LoginForbidInviteTokenError())
        }
      }

      const wxUser = await this.wxUserRepo.getUserByWxOpenId(wxJsCodeToSessionResult.openid)
      const user = await this.userRepo.getUserByUserId(wxUser.id.toString())

      const loginDTOResponse = await this.authorizationService.getAceessTokenWithRefreshToken(user)
      await this.userRepo.save(user)

      return right(Result.ok<WxAuthorizationDtoResult>(loginDTOResponse))
    } catch (err) {
      return left(new AppError.UnexpectedError(err.toString()))
    }
  }
}
