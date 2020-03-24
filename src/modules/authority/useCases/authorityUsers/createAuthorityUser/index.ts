import { CreateAuthorityUserUseCase } from './createAuthorityUserUseCase'
import { authorityUserRepo } from '../../../repos'
import { CreateAuthorityUserController } from './createAuthorityUserController'

const createAuthorityUserUseCase = new CreateAuthorityUserUseCase(authorityUserRepo)
const createAuthorityUserController = new CreateAuthorityUserController(createAuthorityUserUseCase)
export { createAuthorityUserUseCase, createAuthorityUserController }
