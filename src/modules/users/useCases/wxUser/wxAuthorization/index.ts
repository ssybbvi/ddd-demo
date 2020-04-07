import { userRepo, wxUserRepo } from '../../../repos'
import { WxAuthorizationUseCase } from './wxAuthorizationUseCase'
import { WxAuthorizationController } from './wxAuthorizationController'
import { createWxUserUseCase } from '../createWxUser'
import { recommendedByInviteTokenUseCase } from '../../user/recommendedByInviteToken'
import { loginUserUseCase } from '../../user/login'
import { refreshSessionKeyUseCase } from '../refreshSessionKey'

const wxAuthorizationUseCase = new WxAuthorizationUseCase(
  userRepo,
  wxUserRepo,
  loginUserUseCase,
  createWxUserUseCase,
  recommendedByInviteTokenUseCase,
  refreshSessionKeyUseCase
)

const wxAuthorizationController = new WxAuthorizationController(wxAuthorizationUseCase)

export { wxAuthorizationUseCase, wxAuthorizationController }
