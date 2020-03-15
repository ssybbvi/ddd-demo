import { DistributionFundUseCase } from './distributionFundUseCase'
import { fundRepo } from '../../../repos'

const distributionFundUseCase = new DistributionFundUseCase(fundRepo)

export { distributionFundUseCase }
