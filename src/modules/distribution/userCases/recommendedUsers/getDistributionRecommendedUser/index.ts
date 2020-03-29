import { GetDistributionRecommendedUserUseCase } from './getDistributionRecommendedUserUseCase'
import { recommendedUserRepo, signInRepo } from '../../../repos'
import { GetDistributionRecommendedUserController } from './getDistributionRecommendedUserController'
import { fundRepo } from '../../../../funds/repos'
import { wxUserRepo } from '../../../../users/repos'

const getDistributionRecommendedUserUseCase = new GetDistributionRecommendedUserUseCase(fundRepo, wxUserRepo)

const getDistributionRecommendedUserController = new GetDistributionRecommendedUserController(
  getDistributionRecommendedUserUseCase
)

export { getDistributionRecommendedUserUseCase, getDistributionRecommendedUserController }
