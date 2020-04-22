import { GetBargainOrderListUseCase } from "./getBargainOrderListUseCase";
import { bargainOrderRepo } from "../../../repos";
import { GetBargainOrderListController } from "./getBargainOrderListController";


const getBargainOrderListUseCase = new GetBargainOrderListUseCase(bargainOrderRepo)
const getBargainOrderListController = new GetBargainOrderListController(getBargainOrderListUseCase)

export { getBargainOrderListUseCase, getBargainOrderListController }