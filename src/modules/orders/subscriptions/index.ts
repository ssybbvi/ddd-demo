import { AfterOrderPaymented } from "./afterOrderPaymented";
import { orderRepo } from "../repos";
import { cancelOrderUseCase } from "../useCases/order/cancelOrder";
import { buyOnceCommodityUseCase } from "../useCases/orderUser/buyOnceCommodity";
import { createOrderUserUseCase } from "../useCases/orderUser/createOrderUser";
import { AfterUserCreated } from "./afterUserCreated";


new AfterOrderPaymented(buyOnceCommodityUseCase, orderRepo, cancelOrderUseCase)
new AfterUserCreated(createOrderUserUseCase)