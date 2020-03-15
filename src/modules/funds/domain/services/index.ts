import { FundService } from './fundService'

import { distributionFundUseCase } from '../../userCases/funds/distributionFund'
import { getMemberUseCase } from '../../../distribution/userCases/members/getMember'

const fundService = new FundService(distributionFundUseCase, getMemberUseCase)

export { fundService }
