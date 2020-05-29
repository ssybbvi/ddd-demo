import { CreateStrategyUseCase } from './createStrategyUseCase'
import { strategyRepo } from '../../../repos'
import { CreateStrategyController } from './createStrategyController'

const createStrategyUseCase = new CreateStrategyUseCase(strategyRepo)
const createStrategyController = new CreateStrategyController(createStrategyUseCase)

export { createStrategyUseCase, createStrategyController }
