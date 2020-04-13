import { GetOrderUserController } from "./getOrderUserController";
import { GetOrderUserUseCase } from "./getOrderUserUseCase";
import { orderUserRepo } from "../../../repos";
const getOrderUserUseCase = new GetOrderUserUseCase(orderUserRepo)
const getOrderUserController = new GetOrderUserController(getOrderUserUseCase)

export { getOrderUserUseCase, getOrderUserController }