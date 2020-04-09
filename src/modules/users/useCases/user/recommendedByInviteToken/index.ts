import { RecommendedByInviteTokenUseCase } from './recommendedByInviteTokenUseCase'
import { userRepo } from '../../../repos'
import { RecommendedByInviteTokenController } from './recommendedByInviteTokenController'

const recommendedByInviteTokenUseCase = new RecommendedByInviteTokenUseCase(userRepo)
const recommendedByInviteTokenController = new RecommendedByInviteTokenController(recommendedByInviteTokenUseCase)
export { recommendedByInviteTokenUseCase, recommendedByInviteTokenController }
