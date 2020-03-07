import { userRepo } from '../../repos'
import { authorizationService } from '../../services'
import { WxAuthrizationService } from '../../services/wxAuthrizationService'
import { WxAuthorizationUseCase } from './wxAuthorizationUseCase'
import { WxAuthorizationController } from './wxAuthorizationController'

const wxAuthrizationService = new WxAuthrizationService()
const wxAuthorizationUseCase = new WxAuthorizationUseCase(userRepo, authorizationService, wxAuthrizationService)

const wxAuthorizationController = new WxAuthorizationController(wxAuthorizationUseCase)

export { wxAuthorizationUseCase, wxAuthorizationController }
