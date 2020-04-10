import { AppError } from '../../../../../shared/core/AppError'
import { Either, Result, left, right } from '../../../../../shared/core/Result'
import { UseCase } from '../../../../../shared/core/UseCase'

import { WxAuthorizationDto } from './wxAuthorizationDto'
import { WxAuthorizationErrors } from './wxAuthorizationErrors'
import { IWxUserRepo } from '../../../repos/wxUserRepo'
import { CreateWxUserUseCase } from '../createWxUser/createWxUserUseCase'
import { LoginDTOResponse } from '../../user/login/LoginDTO'
import { LoginUserUseCase } from '../../user/login/LoginUseCase'
import { RefreshSessionKeyUseCase } from '../refreshSessionKey/refreshSessionKeyUseCase'
import { WechatUtil, WechatRetError, WechatSession } from '../../../../../shared/infra/wx/wxCommon'
import { RecommendedByInviteTokenUseCase } from '../../user/recommendedByInviteToken/recommendedByInviteTokenUseCase'

type Response = Either<
  | WxAuthorizationErrors.WxJsCodeToSessionError
  | WxAuthorizationErrors.LoginForbidInviteTokenError
  | WxAuthorizationErrors.InviteTokenInValidError
  | AppError.UnexpectedError
  | Result<any>,
  Result<LoginDTOResponse>
>

export class WxAuthorizationUseCase implements UseCase<WxAuthorizationDto, Promise<Response>> {
  private wxUserRepo: IWxUserRepo
  private loginUserUseCase: LoginUserUseCase
  private createWxUserUseCase: CreateWxUserUseCase
  private refreshSessionKeyUseCase: RefreshSessionKeyUseCase
  private recommendedByInviteTokenUseCase: RecommendedByInviteTokenUseCase

  constructor(
    wxUserRepo: IWxUserRepo,
    loginUserUseCase: LoginUserUseCase,
    createWxUserUseCase: CreateWxUserUseCase,
    refreshSessionKeyUseCase: RefreshSessionKeyUseCase,
    recommendedByInviteTokenUseCase: RecommendedByInviteTokenUseCase
  ) {
    this.wxUserRepo = wxUserRepo
    this.loginUserUseCase = loginUserUseCase
    this.createWxUserUseCase = createWxUserUseCase
    this.refreshSessionKeyUseCase = refreshSessionKeyUseCase
    this.recommendedByInviteTokenUseCase = recommendedByInviteTokenUseCase
  }

  public async execute(request: WxAuthorizationDto): Promise<Response> {
    try {
      const { code, inviteToken } = request

      let jsCodeToSessionResult = await WechatUtil.jsCodeToSession(code)
      if ('errmsg' in jsCodeToSessionResult) {
        return left(Result.fail<WechatRetError>(JSON.stringify(jsCodeToSessionResult)))
      }

      const wechatSession = jsCodeToSessionResult as WechatSession

      let wxUser = await this.wxUserRepo.getUserByWxOpenId(wechatSession.openid)
      if (!wxUser) {
        const createWxUserUseCaseResult = await this.createWxUserUseCase.execute({
          openId: wechatSession.openid,
          unionId: wechatSession.unionid,
          sessionKey: wechatSession.session_key,
        })

        if (createWxUserUseCaseResult.isLeft()) {
          return left(createWxUserUseCaseResult.value)
        }
        wxUser = await this.wxUserRepo.getUserByWxOpenId(wechatSession.openid)

        if (inviteToken) {
          const recommendedByInviteTokenUseCaseResult = await this.recommendedByInviteTokenUseCase.execute({
            userId: wxUser.id.toString(),
            inviteToken: inviteToken
          })
          if (recommendedByInviteTokenUseCaseResult.isLeft()) {
            return left(recommendedByInviteTokenUseCaseResult.value)
          }
        }
      }

      const refreshSessionKeyUseCaseResult = await this.refreshSessionKeyUseCase.execute({
        userId: wxUser.id.toString(),
        sessionKey: wechatSession.session_key
      })
      if (refreshSessionKeyUseCaseResult.isLeft()) {
        return left(refreshSessionKeyUseCaseResult.value)
      }


      const loginUserUseCaseResult = await this.loginUserUseCase.execute({
        userId: wxUser.id.toString()
      })

      const loginUserUseCaseResultValue = loginUserUseCaseResult.value
      if (loginUserUseCaseResult.isLeft()) {
        return left(loginUserUseCaseResultValue)
      }

      const loginDTOResponse = loginUserUseCaseResultValue.getValue() as LoginDTOResponse
      return right(Result.ok<LoginDTOResponse>(loginDTOResponse))
    } catch (err) {
      return left(new AppError.UnexpectedError(err.toString()))
    }
  }
}
