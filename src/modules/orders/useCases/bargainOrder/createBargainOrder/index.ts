import { CreateBargainOrderUseCase } from "./createBargainOrderUseCase";
import { bargainOrderRepo } from "../../../repos";
import { commodityRepo } from "../../../../commoditys/repos";
import { CreateBargainOrderController } from "./createBargainOrderController";


const createBargainOrderUseCase = new CreateBargainOrderUseCase(commodityRepo, bargainOrderRepo)
const createBargainOrderController = new CreateBargainOrderController(createBargainOrderUseCase)

export { createBargainOrderUseCase, createBargainOrderController }