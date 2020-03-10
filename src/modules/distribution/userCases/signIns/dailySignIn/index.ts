import { DailySignInUseCase } from './dailySignInUseCase'
import { DailySignInController } from './dailySignInController'
import { signInRepo } from '../../../repos'

const dailySignInUseCase = new DailySignInUseCase(signInRepo)

const dailySignInController = new DailySignInController(dailySignInUseCase)

export { dailySignInUseCase, dailySignInController }
