import { saleCommodityUseCase } from "../userCases/commoditys/saleCommodity"
import { AfterOrderPaymented } from "./afterOrderPaymented"
import { createPurchaseHistoryUseCase } from "../userCases/purchaseHistory/createPurchaseHistory"
import { withdrawCommodityUseCase } from "../userCases/commoditys/withdrawCommodity"
import { AfterOrderCanceled } from "./afterOrderCanceled"


// Subscriptions
new AfterOrderCanceled(withdrawCommodityUseCase)
new AfterOrderPaymented(saleCommodityUseCase, createPurchaseHistoryUseCase)
