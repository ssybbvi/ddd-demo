import express from 'express'
import { middleware } from '../../../../../shared/infra/http'

import { getOrderUserController } from '../../../useCases/orderUser/getOrderUser'

const orderUserRouter = express.Router()

orderUserRouter.get('/', middleware.ensureAuthenticated(), (req, res) => getOrderUserController.execute(req, res))

export { orderUserRouter }
