import { GetUserByInviteRecommendedUserIdUseCase } from './getUserByInviteRecommendedUserIdUseCase'
import { userRepo } from '../../repos'

const getUserByInviteRecommendedUserIdUseCase = new GetUserByInviteRecommendedUserIdUseCase(userRepo)

export { getUserByInviteRecommendedUserIdUseCase }
