import express from 'express'
import { middleware } from '../../../../../shared/infra/http'
import { createCommodityController } from '../../../userCases/commoditys/craeteCommodity'
import { getCommodityController } from '../../../userCases/commoditys/getCommodity'
import { getCommodityByIdController } from '../../../userCases/commoditys/getCommodityById'
import { editCommodityController } from '../../../userCases/commoditys/editCommodity'

const commodityRouter = express.Router()

commodityRouter.post('/', (req, res) => createCommodityController.execute(req, res))
commodityRouter.get('/:commodityId', (req, res) => getCommodityByIdController.execute(req, res))
commodityRouter.get('/', (req, res) => getCommodityController.execute(req, res))
commodityRouter.put('/', (req, res) => editCommodityController.execute(req, res))

export { commodityRouter }
