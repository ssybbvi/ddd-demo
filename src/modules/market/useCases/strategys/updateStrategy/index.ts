import { strategyRepo } from '../../../repos'
import { UpdateStrategyUseCase } from './updateStrategyUseCase'
import { UpdateStrategyController } from './updateStrategyController'

const updateStrategyUseCase = new UpdateStrategyUseCase(strategyRepo)
const updateStrategyController = new UpdateStrategyController(updateStrategyUseCase)

export { updateStrategyUseCase, updateStrategyController }
