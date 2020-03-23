import { CreateRecommendedUser } from './createRecommendedUser'
import { recommendedUserRepo } from '../../../repos'

const createRecommendedUser = new CreateRecommendedUser(recommendedUserRepo)

export { createRecommendedUser }
