import { memberRepo, signInRepo, fundRepo, fundAccountRepo } from '../../../repos'
import { GetFundAccountUseCase } from './getFundAccountUseCase'
import { GetFundAccountController } from './getFundAccountController'

const getFundAccountUseCase = new GetFundAccountUseCase(fundAccountRepo)

const getFundAccountController = new GetFundAccountController(getFundAccountUseCase)

export { getFundAccountUseCase, getFundAccountController }
