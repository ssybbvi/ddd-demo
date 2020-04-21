import { UpdateCommodityTagController } from "../updateCommodityTag/updateCommodityTagController";
import { GetCommodityTagListUseCase } from "./getCommodityTagListUseCase";
import { commodityTagRepo } from "../../../repos";
import { GetCommodityTagListController } from "./getCommodityTagListController";

const getCommodityTagListUseCase = new GetCommodityTagListUseCase(commodityTagRepo)
const getCommodityTagListController = new GetCommodityTagListController(getCommodityTagListUseCase)

export { getCommodityTagListUseCase, getCommodityTagListController }