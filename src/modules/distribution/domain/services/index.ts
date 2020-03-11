import { FundService } from './fundService'

import { getMemberUseCase } from '../../userCases/members/getMember'
import { distributionFundUseCase } from '../../userCases/funds/distributionFund'

const fundService = new FundService(distributionFundUseCase, getMemberUseCase)
export { fundService }
