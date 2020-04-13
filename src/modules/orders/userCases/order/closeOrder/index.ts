import { CloseOrderUseCase } from "./closeOrderUseCase";
import { orderRepo } from "../../../repos";
import { CloseOrderController } from "./closeOrderController";


const closeOrderUseCase = new CloseOrderUseCase(orderRepo)
const closeOrderController = new CloseOrderController(closeOrderUseCase)

export { closeOrderUseCase, closeOrderController }