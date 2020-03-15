import { GetDistributionMemberUseCase } from './getDistributionMemberUseCase'
import { memberRepo, signInRepo } from '../../../repos'
import { GetDistributionMemberController } from './getDistributionMemberController'
import { fundRepo } from '../../../../funds/repos'

const getDistributionMemberUseCase = new GetDistributionMemberUseCase(memberRepo, fundRepo)

const getDistributionMemberController = new GetDistributionMemberController(getDistributionMemberUseCase)

export { getDistributionMemberUseCase, getDistributionMemberController }
