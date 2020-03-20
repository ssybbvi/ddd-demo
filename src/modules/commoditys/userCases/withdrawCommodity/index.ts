import { WithdrawCommodityUseCase } from "./withdrawCommodityUseCase";
import { commodityRepo } from "../../repos";


const withdrawCommodityUseCase=new WithdrawCommodityUseCase(commodityRepo)

export {withdrawCommodityUseCase}