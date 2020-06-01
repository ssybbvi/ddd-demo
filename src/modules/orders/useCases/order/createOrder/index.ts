import { CreateOrderUseCase } from './createOrderUseCase'
import { orderRepo } from '../../../repos'
import { CreateOrderController } from './createOrderController'
import { orderAssertionService } from '../../../domain/service'
import { getActivityRewardUseCase } from '../../../../market/useCases/avtitvtys/getActivityReward'

const createOrderUseCase = new CreateOrderUseCase(orderRepo, orderAssertionService, getActivityRewardUseCase)
const createOrderController = new CreateOrderController(createOrderUseCase)

export { createOrderUseCase, createOrderController }
