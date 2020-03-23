import { CreateAuthorityUser } from './CreateAuthorityUser'
import { userRepo } from '../../../../users/repos'
import { authorityUserRepo } from '../../../repos'

const createAuthorityUser = new CreateAuthorityUser(userRepo, authorityUserRepo)

export { createAuthorityUser }
