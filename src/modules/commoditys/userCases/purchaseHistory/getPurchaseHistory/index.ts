import { GetPurchaseHistoryUseCase } from "./getPurchaseHistoryUseCase";
import { purchaseHistoryRepo } from "../../../repos";
import { GetPurchaseHistoryController } from "./getPurchaseHistoryController";


const getPurchaseHistoryUseCase = new GetPurchaseHistoryUseCase(purchaseHistoryRepo)
const getPurchaseHistoryController = new GetPurchaseHistoryController(getPurchaseHistoryUseCase)

export { getPurchaseHistoryUseCase, getPurchaseHistoryController }