import { GetFundListUseCase } from './getFundListUseCase'
import { memberRepo, signInRepo, fundRepo } from '../../../repos'
import { GetFundListController } from './getFundListController'

const getFundListUseCase = new GetFundListUseCase(fundRepo)

const getFundListController = new GetFundListController(getFundListUseCase)

export { getFundListUseCase, getFundListController }
