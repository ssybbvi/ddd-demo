import { GetListUseCase } from "./getListUseCase";
import { wxUserRepo } from "../../../repos";
import { GetListController } from "./getListController";


const getListUseCase = new GetListUseCase(wxUserRepo)
const getListController = new GetListController(getListUseCase)

export { getListUseCase, getListController }