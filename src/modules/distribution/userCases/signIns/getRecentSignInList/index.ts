import { signInRepo } from '../../../repos'
import { GetRecentSignInUseCase } from './getRecentSignInUseCase'
import { GetRecentSignInController } from './getRecentSignInController'

const getRecentSignInUseCase = new GetRecentSignInUseCase(signInRepo)

const getRecentSignInController = new GetRecentSignInController(getRecentSignInUseCase)

export { getRecentSignInUseCase, getRecentSignInController }
