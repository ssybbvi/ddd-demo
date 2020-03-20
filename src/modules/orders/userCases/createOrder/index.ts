import { CreateOrderUseCase } from "./createOrderUseCase";
import { orderRepo } from "../../repos";
import { CreateOrderController } from "./createOrderController";
import { commodityRepo } from "../../../commoditys/repos";

const createOrderUseCase=new CreateOrderUseCase(orderRepo,commodityRepo)
const createOrderController=new CreateOrderController(createOrderUseCase)

export {
    createOrderUseCase,
    createOrderController
}