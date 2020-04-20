import { AutoCancelOrderUseCase } from "./autoCancelOrderUseCase";
import { orderRepo } from "../../../repos";
import { AutoCancelOrderController } from "./autoCancelOrderController";

const autoCancelOrderUseCase = new AutoCancelOrderUseCase(orderRepo)
const autoCancelOrderController = new AutoCancelOrderController(autoCancelOrderUseCase)

export { autoCancelOrderUseCase, autoCancelOrderController }