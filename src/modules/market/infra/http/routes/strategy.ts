import express from 'express'
import { middleware } from '../../../../../shared/infra/http'
import { createStrategyController } from '../../../useCases/strategys/createStrategy'
import { getStrategyListController } from '../../../useCases/strategys/getStrategyList'
import { updateStrategyController } from '../../../useCases/strategys/updateStrategy'
import { getStrategryRewardController } from '../../../useCases/strategys/getStrategryReward'

const strategyRouter = express.Router()

strategyRouter.get('/', middleware.ensureAuthenticated(), (req, res) => getStrategyListController.execute(req, res))
strategyRouter.post('/', middleware.ensureAuthenticated(), (req, res) => createStrategyController.execute(req, res))
strategyRouter.put('/', middleware.ensureAuthenticated(), (req, res) => updateStrategyController.execute(req, res))
strategyRouter.post('/getStrategryReward', (req, res) => getStrategryRewardController.execute(req, res))
export { strategyRouter }
