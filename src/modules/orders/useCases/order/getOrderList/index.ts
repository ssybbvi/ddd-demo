import { orderRepo } from "../../../repos"
import { GetOrderListController } from "./getOrderListController"
import { GetOrderListUseCase } from "./getOrderListUseCase"

const getOrderListUseCase = new GetOrderListUseCase(orderRepo)
const getOrderListController = new GetOrderListController(getOrderListUseCase)

export {
    getOrderListUseCase,
    getOrderListController
}