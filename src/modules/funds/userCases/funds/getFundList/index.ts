import { GetFundListUseCase } from './getFundListUseCase'
import { fundRepo } from '../../../repos'
import { GetFundListController } from './getFundListController'

const getFundListUseCase = new GetFundListUseCase(fundRepo)

const getFundListController = new GetFundListController(getFundListUseCase)

export { getFundListUseCase, getFundListController }
