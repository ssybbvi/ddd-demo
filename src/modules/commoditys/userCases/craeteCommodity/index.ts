import { CreateCommodityUseCase } from './craeteCommodityCaseUse'
import { commodityRepo } from '../../repos'
import { CreateCommodityController } from './createCommodityController'

let createCommodityUseCase = new CreateCommodityUseCase(commodityRepo)
let createCommodityController = new CreateCommodityController(createCommodityUseCase)

export { createCommodityUseCase, createCommodityController }
