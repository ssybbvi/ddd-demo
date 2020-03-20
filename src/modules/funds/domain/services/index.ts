import { FundService } from './fundService'

import { getMemberUseCase } from '../../../distribution/userCases/members/getMember'
import {createFundUseCase} from '../../userCases/funds/createFund'

const fundService = new FundService(getMemberUseCase,createFundUseCase)

export { fundService }
