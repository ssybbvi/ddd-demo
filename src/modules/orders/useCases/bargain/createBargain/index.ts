import { CreateBargainUseCase } from "./createBargainUseCase";
import { bargainRepo } from "../../../repos";
import { commodityRepo } from "../../../../commoditys/repos";
import { CreateBargainController } from "./createBargainController";


const createBargainUseCase = new CreateBargainUseCase(commodityRepo, bargainRepo)
const createBargainController = new CreateBargainController(createBargainUseCase)

export { createBargainUseCase, createBargainController }