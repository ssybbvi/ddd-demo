import { BargainService } from "./bargainService";
import { OrderAssertionService } from "./assertionService";
import { getOrderUserUseCase } from "../../useCases/orderUser/getOrderUser";
import { getCommodityByIdUseCase } from "../../../commoditys/userCases/commoditys/getCommodityById";


const bargainService = new BargainService()
const orderAssertionService = new OrderAssertionService(getOrderUserUseCase, getCommodityByIdUseCase)
export { bargainService, orderAssertionService }