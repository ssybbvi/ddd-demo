import { AfterOrderPaymented } from "./afterOrderPaymented";
import { orderRepo } from "../repos";
import { cancelOrderUseCase } from "../userCases/order/cancelOrder";
import { buyOnceCommodityUseCase } from "../userCases/orderUser/buyOnceCommodity";
import { createOrderUserUseCase } from "../userCases/orderUser/createOrderUser";
import { AfterUserCreated } from "./afterUserCreated";


new AfterOrderPaymented(buyOnceCommodityUseCase, orderRepo, cancelOrderUseCase)
new AfterUserCreated(createOrderUserUseCase)