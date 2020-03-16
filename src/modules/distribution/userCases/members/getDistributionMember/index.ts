import { GetDistributionMemberUseCase } from './getDistributionMemberUseCase'
import { memberRepo, signInRepo } from '../../../repos'
import { GetDistributionMemberController } from './getDistributionMemberController'
import { fundRepo } from '../../../../funds/repos'
import { userRepo } from '../../../../users/repos'

const getDistributionMemberUseCase = new GetDistributionMemberUseCase(fundRepo, userRepo)

const getDistributionMemberController = new GetDistributionMemberController(getDistributionMemberUseCase)

export { getDistributionMemberUseCase, getDistributionMemberController }
