import { ShippedOrderUseCase } from "./shippedOrderUseCase";
import { orderRepo } from "../../repos";
import { ShippedOrderController } from "./shippedOrderController";


const shippedOrderUseCase = new ShippedOrderUseCase(orderRepo)
const shippedOrderController = new ShippedOrderController(shippedOrderUseCase)

export { shippedOrderUseCase, shippedOrderController }
