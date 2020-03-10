import { GetDistributionMemberUseCase } from './getDistributionMemberUseCase'
import { memberRepo, signInRepo, fundRepo } from '../../../repos'
import { GetDistributionMemberController } from './getDistributionMemberController'

const getDistributionMemberUseCase = new GetDistributionMemberUseCase(memberRepo, fundRepo)

const getDistributionMemberController = new GetDistributionMemberController(getDistributionMemberUseCase)

export { getDistributionMemberUseCase, getDistributionMemberController }
