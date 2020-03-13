import { signInRepo } from '../../../repos'
import { DailySuperSignInUseCase } from './dailySuperSignInUseCase'
import { DailySuperSignInController } from './dailySuperSignInController'
import { SignInService } from '../../../domain/services/signInService'

const signInService = new SignInService()
const dailySuperSignInUseCase = new DailySuperSignInUseCase(signInRepo, signInService)

const dailySuperSignInController = new DailySuperSignInController(dailySuperSignInUseCase)

export { dailySuperSignInUseCase, dailySuperSignInController }
