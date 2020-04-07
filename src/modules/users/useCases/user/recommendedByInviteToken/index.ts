import { RecommendedByInviteTokenUseCase } from './recommendedByInviteTokenUseCase'
import { userRepo } from '../../../repos'

const recommendedByInviteTokenUseCase = new RecommendedByInviteTokenUseCase(userRepo)

export { recommendedByInviteTokenUseCase }
