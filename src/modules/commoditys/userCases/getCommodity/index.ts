import { GetCommodityController } from "./getCommodityController";
import { GetCommodityUseCase } from "./getCommodityUseCase";
import {commodityRepo} from '../../repos'

const getCommodityUseCase=new GetCommodityUseCase(commodityRepo)
const getCommodityController=new GetCommodityController(getCommodityUseCase)
export {
    getCommodityUseCase,getCommodityController
} 