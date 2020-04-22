import { CreateDeliveryOrderUseCase } from "./createDeliveryOrderUseCase";
import { deliveryOrderRepo } from "../../../repos";

const createDeliveryOrderUseCase = new CreateDeliveryOrderUseCase(deliveryOrderRepo)

export { createDeliveryOrderUseCase }