import { FundService } from './fundService'

import { getRecommendedUserUseCase } from '../../../distribution/userCases/recommendedUsers/getRecommendedUser'
import {createFundUseCase} from '../../userCases/funds/createFund'

const fundService = new FundService(getRecommendedUserUseCase,createFundUseCase)

export { fundService }
