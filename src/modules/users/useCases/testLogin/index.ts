import { userRepo } from '../../repos'
import { authorizationService } from '../../services'
import { WxAuthrizationService } from '../../services/wxAuthrizationService'
import { TestLoginController } from './testLoginController'
import { TestLoginUseCase } from './testLoginUseCase'

const testLoginUseCase = new TestLoginUseCase(userRepo, authorizationService)

const testLoginController = new TestLoginController(testLoginUseCase)

export { testLoginUseCase, testLoginController }
