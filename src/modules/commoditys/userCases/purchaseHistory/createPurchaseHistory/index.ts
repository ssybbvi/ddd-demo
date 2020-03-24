import { CreatePurchaseHistoryUseCase } from "./createPurchaseHistoryUseCase";
import { purchaseHistoryRepo } from "../../../repos";
import { userRepo } from "../../../../users/repos";


const createPurchaseHistoryUseCase = new CreatePurchaseHistoryUseCase(purchaseHistoryRepo, userRepo)

export { createPurchaseHistoryUseCase }