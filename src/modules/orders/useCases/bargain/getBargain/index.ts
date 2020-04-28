import { GetBargainUseCase } from "./getBargainUseCase";
import { bargainRepo } from "../../../repos";
import { GetBargainController } from "./getBargainController";


const getBargainUseCase = new GetBargainUseCase(bargainRepo)
const getBargainController = new GetBargainController(getBargainUseCase)

export { getBargainUseCase, getBargainController }
