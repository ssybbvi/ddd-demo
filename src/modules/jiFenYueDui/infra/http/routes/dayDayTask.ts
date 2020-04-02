import express from 'express'
import { middleware } from '../../../../../shared/infra/http'
import { getDayDayTaskListController } from '../../../userCases/getDayDayTaskList'
import { completeTaskController } from '../../../userCases/completeTask'
import { receiveRewardController } from '../../../userCases/receiveReward'


const dayDayTaskRouter = express.Router()

dayDayTaskRouter.get('/', middleware.ensureAuthenticated(), (req, res) => getDayDayTaskListController.execute(req, res))
dayDayTaskRouter.post('/', middleware.ensureAuthenticated(), (req, res) => completeTaskController.execute(req, res))
dayDayTaskRouter.put('/getReward', middleware.ensureAuthenticated(), (req, res) => receiveRewardController.execute(req, res))

export { dayDayTaskRouter }
