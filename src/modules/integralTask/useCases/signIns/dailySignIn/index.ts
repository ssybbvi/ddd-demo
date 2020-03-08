import { signInRepo } from '../../../repos'
import { DailySignInUseCase } from './dailySignInUseCase'
import { DailySignInController } from './dailySignInController'

const dailySignInUseCase = new DailySignInUseCase(signInRepo)

const dailySignInController = new DailySignInController(dailySignInUseCase)

export { dailySignInUseCase, dailySignInController }
