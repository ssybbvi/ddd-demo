import { GetAuthorityUserListUseCase } from './getAuthorityUserUseCase'
import { authorityUserRepo } from '../../../repos'
import { GetAuthorityUserListController } from './getAuthorityUserController'

const getAuthorityUserListUseCase = new GetAuthorityUserListUseCase(authorityUserRepo)

const getAuthorityUserListController = new GetAuthorityUserListController(getAuthorityUserListUseCase)

export { getAuthorityUserListUseCase, getAuthorityUserListController }
