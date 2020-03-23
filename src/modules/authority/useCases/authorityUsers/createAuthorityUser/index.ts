import { CreateAuthorityUserUseCase } from './createAuthorityUserUseCase'
import { userRepo } from '../../../../users/repos'
import { authorityUserRepo } from '../../../repos'
import { CreateAuthorityUserController } from './createAuthorityUserController'

const createAuthorityUserUseCase = new CreateAuthorityUserUseCase(userRepo, authorityUserRepo)
const createAuthorityUserController = new CreateAuthorityUserController(createAuthorityUserUseCase)
export { createAuthorityUserUseCase, createAuthorityUserController }
