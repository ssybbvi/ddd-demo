import { GetDailySignInCountByUserIdUseCase } from './getDailySignInCountByUserIdUseCase'
import { signInRepo } from '../../../repos'

const getDailySignInCountByUserIdUseCase = new GetDailySignInCountByUserIdUseCase(signInRepo)

export { getDailySignInCountByUserIdUseCase }
