import { CreateOrderUseCase } from "./createOrderUseCase";
import { orderRepo } from "../../../repos";
import { CreateOrderController } from "./createOrderController";
import { commodityRepo } from "../../../../commoditys/repos";
import { getOrderUserUseCase } from "../../orderUser/getOrderUser";
import { orderAssertionService } from "../../../domain/service";

const createOrderUseCase = new CreateOrderUseCase(orderRepo, orderAssertionService)
const createOrderController = new CreateOrderController(createOrderUseCase)

export {
    createOrderUseCase,
    createOrderController
}