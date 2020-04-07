import { userRepo, wxUserRepo } from '../../../repos'
import { GetWxCurrentUserUseCase } from './getWxCurrentUserUseCase'
import { GetWxCurrentUserController } from './getWxCurrentUserController'

const getWxCurrentUserUseCase = new GetWxCurrentUserUseCase(wxUserRepo)

const getWxCurrentUserController = new GetWxCurrentUserController(getWxCurrentUserUseCase)

export { getWxCurrentUserUseCase, getWxCurrentUserController }
