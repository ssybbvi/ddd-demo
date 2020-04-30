import { CreatePurchaseHistoryUseCase } from './createPurchaseHistoryUseCase'
import { purchaseHistoryRepo } from '../../../repos'

const createPurchaseHistoryUseCase = new CreatePurchaseHistoryUseCase(purchaseHistoryRepo)

export { createPurchaseHistoryUseCase }
