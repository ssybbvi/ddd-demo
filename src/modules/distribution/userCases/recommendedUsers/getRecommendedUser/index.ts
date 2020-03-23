import { GetRecommendedUserUseCase } from './getRecommendedUserUseCase'
import { recommendedUserRepo } from '../../../repos'

const getRecommendedUserUseCase = new GetRecommendedUserUseCase(recommendedUserRepo)

export { getRecommendedUserUseCase }
