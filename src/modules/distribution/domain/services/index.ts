import { FundService } from './fundService'

import { getMemberUseCase } from '../../userCases/members/getMember'
import { distributionFundUseCase } from '../../userCases/funds/distributionFund'
import { SignInService } from './signInService'

const fundService = new FundService(distributionFundUseCase, getMemberUseCase)

const signInService = new SignInService()
export { fundService, signInService }
