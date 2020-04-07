import { CreateScheduledTaskUseCase } from './createScheduledTaskUseCase'
import { scheduledTaskRepo } from '../../../repos'

const createScheduledTaskUseCase = new CreateScheduledTaskUseCase(scheduledTaskRepo)

export { createScheduledTaskUseCase }
