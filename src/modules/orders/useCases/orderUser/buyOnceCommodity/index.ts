import { BuyOnceCommodityUseCase } from "./buyOnceCommodityUseCase";
import { orderUserRepo } from "../../../repos";


const buyOnceCommodityUseCase = new BuyOnceCommodityUseCase(orderUserRepo)

export { buyOnceCommodityUseCase }