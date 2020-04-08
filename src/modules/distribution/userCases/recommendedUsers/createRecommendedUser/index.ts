import { CreateRecommendedUser } from './createRecommendedUser'
import { recommendedUserRepo } from '../../../repos'
import { userRepo } from '../../../../users/repos'

const createRecommendedUser = new CreateRecommendedUser(recommendedUserRepo, userRepo)

export { createRecommendedUser }
