import { GetBargainOrderUseCase } from "./getBargainOrderUseCase";
import { bargainOrderRepo } from "../../../repos";
import { GetBargainOrderController } from "./getBargainOrderController";


const getBargainOrderUseCase = new GetBargainOrderUseCase(bargainOrderRepo)
const getBargainOrderController = new GetBargainOrderController(getBargainOrderUseCase)

export { getBargainOrderUseCase, getBargainOrderController }
