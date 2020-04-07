import { upUserRepo } from '../../../repos'
import { loginUserUseCase } from '../../user/login'
import { UpAuthorizationController } from './upAuthorizationController'
import { UpAuthorizationUseCase } from './upAuthorizationUseCase'

const upAuthorizationUseCase = new UpAuthorizationUseCase(upUserRepo, loginUserUseCase)

const upAuthorizationController = new UpAuthorizationController(upAuthorizationUseCase)

export { upAuthorizationUseCase, upAuthorizationController }
