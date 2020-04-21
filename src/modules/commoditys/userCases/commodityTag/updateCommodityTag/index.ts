import { commodityTagRepo } from "../../../repos"
import { UpdateCommodityTagUseCase } from "./updateCommodityTagUseCase"
import { UpdateCommodityTagController } from "./updateCommodityTagController"

const updateCommodityTagUseCase = new UpdateCommodityTagUseCase(commodityTagRepo)
const updateCommodityTagController = new UpdateCommodityTagController(updateCommodityTagUseCase)

export { updateCommodityTagUseCase, updateCommodityTagController }