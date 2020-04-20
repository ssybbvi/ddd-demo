import { CreateOrderUseCase } from "./createOrderUseCase";
import { orderRepo } from "../../../repos";
import { CreateOrderController } from "./createOrderController";
import { commodityRepo } from "../../../../commoditys/repos";
import { getOrderUserUseCase } from "../../orderUser/getOrderUser";

const createOrderUseCase = new CreateOrderUseCase(orderRepo, commodityRepo, getOrderUserUseCase)
const createOrderController = new CreateOrderController(createOrderUseCase)

export {
    createOrderUseCase,
    createOrderController
}