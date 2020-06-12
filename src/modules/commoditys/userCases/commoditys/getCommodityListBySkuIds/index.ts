import { GetCommodityListBySkuIdsUseCase } from './getCommodityListBySkuIdsUseCase'
import { commodityRepo } from '../../../repos'
import { GetCommodityListBySkuIdsFillRequestController } from './getCommodityListBySkuIdsFillRequestController'
import { GetCommodityListBySkuIdsController } from './getCommodityListBySkuIdsController'

const getCommodityListBySkuIdsUseCase = new GetCommodityListBySkuIdsUseCase(commodityRepo)
const getCommodityListBySkuIdsFillRequestController = new GetCommodityListBySkuIdsFillRequestController(
  getCommodityListBySkuIdsUseCase
)
const getCommodityListBySkuIdsController = new GetCommodityListBySkuIdsController(getCommodityListBySkuIdsUseCase)

export {
  getCommodityListBySkuIdsUseCase,
  getCommodityListBySkuIdsFillRequestController,
  getCommodityListBySkuIdsController,
}
