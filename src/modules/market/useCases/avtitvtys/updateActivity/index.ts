import { UpdateActivityUseCase } from './updateActivityUseCase'
import { UpdateActivityController } from './updateActivityController'
import { activityRepo } from '../../../repos'

const updateActivityUseCase = new UpdateActivityUseCase(activityRepo)
const updateActivityController = new UpdateActivityController(updateActivityUseCase)

export { updateActivityUseCase, updateActivityController }
