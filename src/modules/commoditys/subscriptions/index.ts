import { AfterOrderCanceled } from "./afterOrderCanceled"
import { withdrawCommodityUseCase } from "../userCases/withdrawCommodity"
import { saleCommodityUseCase } from "../userCases/saleCommodity"
import { AfterOrderPaymented } from "./afterOrderPaymented"

 
// Subscriptions
new AfterOrderCanceled(withdrawCommodityUseCase)
new AfterOrderPaymented(saleCommodityUseCase)
