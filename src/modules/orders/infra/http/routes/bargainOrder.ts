import express from 'express'
import { middleware } from '../../../../../shared/infra/http'
import { createBargainOrderController } from '../../../useCases/bargainOrder/createBargainOrder'
import { inviteBargainOrderController } from '../../../useCases/bargainOrder/inviteBargainOrder'
import { getBargainOrderController } from '../../../useCases/bargainOrder/getBargainOrder'
import { getBargainOrderListController } from '../../../useCases/bargainOrder/getBargainOrderList'


const bargainOrderRouter = express.Router()
bargainOrderRouter.get('/', (req, res) => getBargainOrderListController.execute(req, res))
bargainOrderRouter.get('/:bargainOrderId', (req, res) => getBargainOrderController.execute(req, res))
bargainOrderRouter.post('/', middleware.ensureAuthenticated(), (req, res) => createBargainOrderController.execute(req, res))
bargainOrderRouter.put('/', middleware.ensureAuthenticated(), (req, res) => inviteBargainOrderController.execute(req, res))

export { bargainOrderRouter }


