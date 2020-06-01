import { GetActivityListController } from './getActivityListController'
import { activityRepo } from '../../../repos'
import { GetActivityListUseCase } from './getActivityListUseCase'

const getActivityListUseCase = new GetActivityListUseCase(activityRepo)
const getActivityListController = new GetActivityListController(getActivityListUseCase)

export { getActivityListUseCase, getActivityListController }
