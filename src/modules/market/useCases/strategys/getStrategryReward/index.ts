import { GetStrategryRewardUseCase } from './getStrategryRewardUseCase'
import { GetStrategryRewardController } from './getStrategryRewardController'
import { strategyRepo, couponRepo, couponUserRepo } from '../../../repos'
import { commodityRepo } from '../../../../commoditys/repos'

const getStrategryRewardUseCase = new GetStrategryRewardUseCase(couponRepo, strategyRepo, couponUserRepo, commodityRepo)
const getStrategryRewardController = new GetStrategryRewardController(getStrategryRewardUseCase)

export { getStrategryRewardUseCase, getStrategryRewardController }
