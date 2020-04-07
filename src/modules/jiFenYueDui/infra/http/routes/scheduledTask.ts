import express from 'express'
import { executionScheduleTaskController } from '../../../userCases/scheduledTask/executionScheduleTask'

const scheduleTaskRouter = express.Router()

scheduleTaskRouter.get('/', (req, res) => executionScheduleTaskController.execute(req, res))

export { scheduleTaskRouter }
