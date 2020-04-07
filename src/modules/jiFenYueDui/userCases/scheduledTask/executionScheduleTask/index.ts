import { ExecutionScheduleTaskUseCase } from './executionScheduleTaskUseCase'
import { scheduledTaskRepo } from '../../../repos'
import { ExecutionScheduleTaskController } from './executionScheduleTaskController'

const executionScheduleTaskUseCase = new ExecutionScheduleTaskUseCase(scheduledTaskRepo)
const executionScheduleTaskController = new ExecutionScheduleTaskController(executionScheduleTaskUseCase)
export { executionScheduleTaskUseCase, executionScheduleTaskController }
