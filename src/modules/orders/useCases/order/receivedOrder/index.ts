import { ReceivedOrderUseCase } from "./receivedOrderUseCase";
import { orderRepo } from "../../../repos";
import { ReceivedOrderController } from "./receivedOrderController";


const receivedOrderUseCase = new ReceivedOrderUseCase(orderRepo)
const receivedOrderController = new ReceivedOrderController(receivedOrderUseCase)

export { receivedOrderUseCase, receivedOrderController }