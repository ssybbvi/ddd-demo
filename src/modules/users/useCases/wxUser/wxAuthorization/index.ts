import { wxUserRepo } from '../../../repos'
import { WxAuthorizationUseCase } from './wxAuthorizationUseCase'
import { WxAuthorizationController } from './wxAuthorizationController'
import { createWxUserUseCase } from '../createWxUser'
import { loginUserUseCase } from '../../user/login'
import { refreshSessionKeyUseCase } from '../refreshSessionKey'
import { recommendedByInviteTokenUseCase } from '../../user/recommendedByInviteToken'

const wxAuthorizationUseCase = new WxAuthorizationUseCase(
  wxUserRepo,
  loginUserUseCase,
  createWxUserUseCase,
  refreshSessionKeyUseCase,
  recommendedByInviteTokenUseCase
)

const wxAuthorizationController = new WxAuthorizationController(wxAuthorizationUseCase)

export { wxAuthorizationUseCase, wxAuthorizationController }
