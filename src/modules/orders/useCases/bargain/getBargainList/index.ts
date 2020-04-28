import { GetBargainListUseCase } from "./getBargainListUseCase";
import { bargainRepo } from "../../../repos";
import { GetBargainListController } from "./getBargainListController";


const getBargainListUseCase = new GetBargainListUseCase(bargainRepo)
const getBargainListController = new GetBargainListController(getBargainListUseCase)

export { getBargainListUseCase, getBargainListController }