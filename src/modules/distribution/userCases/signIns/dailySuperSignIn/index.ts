import { signInRepo } from '../../../repos'
import { DailySuperSignInUseCase } from './dailySuperSignInUseCase'
import { DailySuperSignInController } from './dailySuperSignInController'

const dailySuperSignInUseCase = new DailySuperSignInUseCase(signInRepo)

const dailySuperSignInController = new DailySuperSignInController(dailySuperSignInUseCase)

export { dailySuperSignInUseCase, dailySuperSignInController }
