import { signInRepo } from '../../../repos'
import { GetRecentSignInUseCase } from './getRecentSignInUseCase'
import { GetRecentSignInController } from './getRecentSignInController'
import { SignInService } from '../../../domain/services/signInService'

const signInService = new SignInService()
const getRecentSignInUseCase = new GetRecentSignInUseCase(signInRepo, signInService)

const getRecentSignInController = new GetRecentSignInController(getRecentSignInUseCase)

export { getRecentSignInUseCase, getRecentSignInController }
