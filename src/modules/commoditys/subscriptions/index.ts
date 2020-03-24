import { saleCommodityUseCase } from "../userCases/commoditys/saleCommodity"
import { AfterOrderPaymented } from "./afterOrderPaymented"
import { createPurchaseHistoryUseCase } from "../userCases/purchaseHistory/createPurchaseHistory"


// Subscriptions
//new AfterOrderCanceled(withdrawCommodityUseCase)
new AfterOrderPaymented(saleCommodityUseCase, createPurchaseHistoryUseCase)
