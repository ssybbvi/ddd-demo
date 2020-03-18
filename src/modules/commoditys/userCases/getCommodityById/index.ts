import { GetCommodityByIdUseCase } from "./getCommodityByIdUseCase";
import { commodityRepo } from "../../repos";
import { GetCommodityByIdController } from "./getCommodityByIdController";


const getCommodityByIdUseCase=new GetCommodityByIdUseCase(commodityRepo)
const getCommodityByIdController=new GetCommodityByIdController(getCommodityByIdUseCase)

export {
    getCommodityByIdUseCase,
    getCommodityByIdController
}