import { strategyRepo } from '../../../repos'
import { GetStrategyListUseCase } from './getStrategyListUseCase'
import { GetStrategyListController } from './getStrategyListController'

const getStrategyListUseCase = new GetStrategyListUseCase(strategyRepo)
const getStrategyListController = new GetStrategyListController(getStrategyListUseCase)

export { getStrategyListUseCase, getStrategyListController }
