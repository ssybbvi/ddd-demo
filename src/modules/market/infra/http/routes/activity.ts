import express from 'express'
import { middleware } from '../../../../../shared/infra/http'
import { createActivityController } from '../../../useCases/avtitvtys/createActivity'
import { updateActivityController } from '../../../useCases/avtitvtys/updateActivity'
import { getActivityListController } from '../../../useCases/avtitvtys/getActivityList'
import { getActivityRewardController } from '../../../useCases/avtitvtys/getActivityReward'

const activityRouter = express.Router()

activityRouter.get('/', middleware.ensureAuthenticated(), (req, res) => getActivityListController.execute(req, res))
activityRouter.post('/', middleware.ensureAuthenticated(), (req, res) => createActivityController.execute(req, res))
activityRouter.put('/', middleware.ensureAuthenticated(), (req, res) => updateActivityController.execute(req, res))
activityRouter.post('/getActivityReward', (req, res) => getActivityRewardController.execute(req, res))
export { activityRouter }
