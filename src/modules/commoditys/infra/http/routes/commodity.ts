import express from 'express'
import { middleware } from '../../../../../shared/infra/http'
import { createCommodityController } from '../../../userCases/craeteCommodity'
import { getCommodityController } from '../../../userCases/getCommodity'

const commodityRouter = express.Router()

commodityRouter.post('/', (req, res) => createCommodityController.execute(req, res))
commodityRouter.get('/', (req, res) => getCommodityController.execute(req, res))

export { commodityRouter }
