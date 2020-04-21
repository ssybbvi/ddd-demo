import { CreateCommodityTagController } from "./createCommodityTagController";
import { CreateCommodityTagUseCase } from "./createCommodityTagUseCase";
import { commodityTagRepo } from "../../../repos";

const createCommodityTagUseCase = new CreateCommodityTagUseCase(commodityTagRepo)
const createCommodityTagController = new CreateCommodityTagController(createCommodityTagUseCase)

export { createCommodityTagUseCase, createCommodityTagController }
