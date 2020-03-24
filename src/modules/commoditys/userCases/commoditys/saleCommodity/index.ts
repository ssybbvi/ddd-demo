import { SaleCommodityUseCase } from "./saleCommodityUseCase";
import { commodityRepo } from "../../../repos";


const saleCommodityUseCase = new SaleCommodityUseCase(commodityRepo)

export { saleCommodityUseCase }