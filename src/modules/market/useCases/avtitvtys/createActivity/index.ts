import { activityRepo } from '../../../repos'
import { CreateActivityUseCase } from './createActivityUseCase'
import { CreateActivityController } from './createActivityController'

const createActivityUseCase = new CreateActivityUseCase(activityRepo)
const createActivityController = new CreateActivityController(createActivityUseCase)

export { createActivityUseCase, createActivityController }
