import { commodityRepo } from '../../../../commoditys/repos'
import { GetActivityRewardUseCase } from './getActivityRewardUseCase'
import { GetActivityRewardController } from './getActivityRewardController'
import { couponRepo, activityRepo, couponUserRepo } from '../../../repos'

const getActivityRewardUseCase = new GetActivityRewardUseCase(couponRepo, activityRepo, couponUserRepo, commodityRepo)
const getActivityRewardController = new GetActivityRewardController(getActivityRewardUseCase)

export { getActivityRewardUseCase, getActivityRewardController }
