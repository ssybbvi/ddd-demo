import { GetOrderUserController } from "./getOrderUserController";
import { GetOrderUserUseCase } from "./getOrderUserUseCase";
import { orderUserRepo } from "../../../repos";

const getOrderUserUseCase = new GetOrderUserUseCase(orderUserRepo)
const getOrderUserController = new GetOrderUserController(getOrderUserUseCase)

console.log("zzzzzzzzzzzzzzzzz", orderUserRepo, getOrderUserUseCase)
export { getOrderUserUseCase, getOrderUserController }