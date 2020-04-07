import { userRepo, wxUserRepo } from '../../../repos'
import { WxAuthrizationService } from '../../../services/wxAuthrizationService'
import { WxAuthorizationUseCase } from './wxAuthorizationUseCase'
import { WxAuthorizationController } from './wxAuthorizationController'
import { createWxUserUseCase } from '../createWxUser'
import { recommendedByInviteTokenUseCase } from '../../user/recommendedByInviteToken'
import { loginUserUseCase } from '../../user/login'

const wxAuthrizationService = new WxAuthrizationService()
const wxAuthorizationUseCase = new WxAuthorizationUseCase(
  userRepo,
  wxUserRepo,
  loginUserUseCase,
  wxAuthrizationService,
  createWxUserUseCase,
  recommendedByInviteTokenUseCase
)

const wxAuthorizationController = new WxAuthorizationController(wxAuthorizationUseCase)

export { wxAuthorizationUseCase, wxAuthorizationController }
