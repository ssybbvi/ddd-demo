import { GetOrderByIdController } from "./getOrderController";
import { GetOrderByIdUseCase } from "./getOrderByIdUseCase";
import { orderRepo } from "../../../repos";

const getOrderByIdUseCase = new GetOrderByIdUseCase(orderRepo)
const getOrderByIdController = new GetOrderByIdController(getOrderByIdUseCase)

export { getOrderByIdUseCase, getOrderByIdController }