import { CreateBargainUseCase } from "./createBargainUseCase";
import { bargainRepo } from "../../../repos";
import { CreateBargainController } from "./createBargainController";
import { orderAssertionService } from "../../../domain/service";


const createBargainUseCase = new CreateBargainUseCase(orderAssertionService, bargainRepo)
const createBargainController = new CreateBargainController(createBargainUseCase)

export { createBargainUseCase, createBargainController }