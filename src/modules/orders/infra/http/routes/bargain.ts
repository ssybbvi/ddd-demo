import express from 'express'
import { middleware } from '../../../../../shared/infra/http'
import { createBargainController } from '../../../useCases/bargain/createBargain'
import { inviteBargainController } from '../../../useCases/bargain/inviteBargain'
import { getBargainController } from '../../../useCases/bargain/getBargain'
import { getBargainListController } from '../../../useCases/bargain/getBargainList'
import { shipController } from '../../../useCases/bargain/ship'
import { receivedController } from '../../../useCases/bargain/received'


const bargainRouter = express.Router()
bargainRouter.get('/', (req, res) => getBargainListController.execute(req, res))
bargainRouter.get('/:bargainId', (req, res) => getBargainController.execute(req, res))
bargainRouter.post('/', middleware.ensureAuthenticated(), (req, res) => createBargainController.execute(req, res))
bargainRouter.put('/invite', middleware.ensureAuthenticated(), (req, res) => inviteBargainController.execute(req, res))
bargainRouter.put('/ship', (req, res) => shipController.execute(req, res))
bargainRouter.put('/received', (req, res) => receivedController.execute(req, res))
export { bargainRouter }


