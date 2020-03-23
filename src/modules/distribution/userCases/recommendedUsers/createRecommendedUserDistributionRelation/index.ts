import { CreateRecommendedUserDistributionRelationUseCase } from './createRecommendedUserDistributionRelationUseCase'
import { recommendedUserRepo } from '../../../repos'

let createRecommendedUserDistributionRelationUseCase = new CreateRecommendedUserDistributionRelationUseCase(recommendedUserRepo)

export { createRecommendedUserDistributionRelationUseCase }
