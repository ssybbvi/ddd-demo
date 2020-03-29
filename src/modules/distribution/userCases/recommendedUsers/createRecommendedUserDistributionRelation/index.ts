import { CreateRecommendedUserDistributionRelationUseCase } from './createRecommendedUserDistributionRelationUseCase'
import { recommendedUserRepo } from '../../../repos'
import { userRepo } from '../../../../users/repos'

let createRecommendedUserDistributionRelationUseCase = new CreateRecommendedUserDistributionRelationUseCase(
  recommendedUserRepo,
  userRepo
)

export { createRecommendedUserDistributionRelationUseCase }
