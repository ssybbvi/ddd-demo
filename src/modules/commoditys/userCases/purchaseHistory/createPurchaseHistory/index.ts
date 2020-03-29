import { CreatePurchaseHistoryUseCase } from './createPurchaseHistoryUseCase'
import { purchaseHistoryRepo } from '../../../repos'
import { wxUserRepo } from '../../../../users/repos'

const createPurchaseHistoryUseCase = new CreatePurchaseHistoryUseCase(purchaseHistoryRepo, wxUserRepo)

export { createPurchaseHistoryUseCase }
