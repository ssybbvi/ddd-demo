import { DailySignInUseCase } from './dailySignInUseCase'
import { DailySignInController } from './dailySignInController'
import { signInRepo } from '../../../repos'
import { sharedRewardToInvitedMemberService } from '../../../domain/services'

const dailySignInUseCase = new DailySignInUseCase(signInRepo, sharedRewardToInvitedMemberService)

const dailySignInController = new DailySignInController(dailySignInUseCase)

export { dailySignInUseCase, dailySignInController }
