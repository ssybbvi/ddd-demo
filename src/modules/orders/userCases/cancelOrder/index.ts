import { CancelOrderUseCase } from "./cancelOrderUseCase";
import { orderRepo } from "../../repos";
import { CancelOrderController } from "./cancelOrderController";


const cancelOrderUseCase=new CancelOrderUseCase(orderRepo)
const cancelOrderController= new CancelOrderController(cancelOrderUseCase)

export { cancelOrderUseCase, cancelOrderController}