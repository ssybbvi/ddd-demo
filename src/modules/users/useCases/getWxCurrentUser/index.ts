import { userRepo } from '../../repos'
import { GetWxCurrentUserUseCase } from './getWxCurrentUserUseCase'
import { GetWxCurrentUserController } from './getWxCurrentUserController'

const getWxCurrentUserUseCase = new GetWxCurrentUserUseCase(userRepo)

const getWxCurrentUserController = new GetWxCurrentUserController(getWxCurrentUserUseCase)

export { getWxCurrentUserUseCase, getWxCurrentUserController }
