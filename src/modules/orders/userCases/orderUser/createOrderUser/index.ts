import { CreateOrderUserUseCase } from "./createOrderUserUseCase";
import { orderUserRepo } from "../../../repos";

const createOrderUserUseCase = new CreateOrderUserUseCase(orderUserRepo)

export { createOrderUserUseCase }