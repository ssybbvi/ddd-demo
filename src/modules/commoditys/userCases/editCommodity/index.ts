import { EditCommodityUseCase } from "./editCommodityUseCase";
import { commodityRepo } from "../../repos";
import { EditCommodityController } from "./editCommdityController";


const editCommodityUseCase=new EditCommodityUseCase(commodityRepo)
const editCommodityController=new EditCommodityController(editCommodityUseCase)

export{ editCommodityUseCase, editCommodityController}