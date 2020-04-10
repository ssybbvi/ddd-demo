import { saleCommodityUseCase } from "../userCases/commoditys/saleCommodity"
import { AfterOrderPaymented } from "./afterOrderPaymented"
import { createPurchaseHistoryUseCase } from "../userCases/purchaseHistory/createPurchaseHistory"
import { withdrawCommodityUseCase } from "../userCases/commoditys/withdrawCommodity"
import { AfterOrderClosed } from "./afterOrderClosed"


// Subscriptions
new AfterOrderClosed(withdrawCommodityUseCase)
new AfterOrderPaymented(saleCommodityUseCase, createPurchaseHistoryUseCase)
