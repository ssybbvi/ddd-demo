import { AppError } from '../../../../../shared/core/AppError'
import { Either, Result, left, right } from '../../../../../shared/core/Result'
import { UseCase } from '../../../../../shared/core/UseCase'
import { IUserRepo } from '../../../repos/userRepo'

import { WxAuthorizationDto } from './wxAuthorizationDto'
import { WxAuthrizationService, WxJsCodeToSessionResult } from '../../../services/wxAuthrizationService'
import { WxAuthorizationErrors } from './wxAuthorizationErrors'
import { IWxUserRepo } from '../../../repos/wxUserRepo'
import { CreateWxUserUseCase } from '../createWxUser/createWxUserUseCase'
import { RecommendedByInviteTokenUseCase } from '../../user/recommendedByInviteToken/recommendedByInviteTokenUseCase'
import { LoginDTOResponse } from '../../user/login/LoginDTO'
import { LoginUserUseCase } from '../../user/login/LoginUseCase'

type Response = Either<
  | WxAuthorizationErrors.WxJsCodeToSessionError
  | WxAuthorizationErrors.LoginForbidInviteTokenError
  | WxAuthorizationErrors.InviteTokenInValidError
  | AppError.UnexpectedError
  | Result<any>,
  Result<LoginDTOResponse>
>

export class WxAuthorizationUseCase implements UseCase<WxAuthorizationDto, Promise<Response>> {
  private userRepo: IUserRepo
  private wxUserRepo: IWxUserRepo
  private loginUserUseCase: LoginUserUseCase
  private wxAuthrizationService: WxAuthrizationService
  private createWxUserUseCase: CreateWxUserUseCase
  private recommendedByInviteTokenUseCase: RecommendedByInviteTokenUseCase

  constructor(
    userRepo: IUserRepo,
    wxUserRepo: IWxUserRepo,
    loginUserUseCase: LoginUserUseCase,
    wxAuthrizationService: WxAuthrizationService,
    createWxUserUseCase: CreateWxUserUseCase,
    recommendedByInviteTokenUseCase: RecommendedByInviteTokenUseCase
  ) {
    this.userRepo = userRepo
    this.wxUserRepo = wxUserRepo
    this.loginUserUseCase = loginUserUseCase
    this.wxAuthrizationService = wxAuthrizationService
    this.createWxUserUseCase = createWxUserUseCase
    this.recommendedByInviteTokenUseCase = recommendedByInviteTokenUseCase
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

        const createWxUserUseCaseResult = await this.createWxUserUseCase.execute({
          openId: wxJsCodeToSessionResult.openid,
          unionId: wxJsCodeToSessionResult.unionid,
          sessionKey: wxJsCodeToSessionResult.session_key,
          nickName: nickName,
          avatarUrl: avatarUrl,
          gender: gender
        })

        if (createWxUserUseCaseResult.isLeft()) {
          return left(createWxUserUseCaseResult.value)
        }
      } else {
        // if (inviteToken) {
        //   return left(new WxAuthorizationErrors.LoginForbidInviteTokenError())
        // }
      }

      const wxUser = await this.wxUserRepo.getUserByWxOpenId(wxJsCodeToSessionResult.openid)

      if (inviteToken) {
        const recommendedByInviteTokenUseCaseResult = await this.recommendedByInviteTokenUseCase.execute({
          userId: wxUser.id.toString(),
          inviteToken: inviteToken
        })

        if (recommendedByInviteTokenUseCaseResult.isLeft()) {
          return left(recommendedByInviteTokenUseCaseResult.value)
        }
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
