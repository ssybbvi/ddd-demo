import express from 'express'
import { middleware } from '../../../../../shared/infra/http'
import { createCommodityController } from '../../../userCases/craeteCommodity'

const commodityRouter = express.Router()

commodityRouter.post('/', (req, res) => createCommodityController.execute(req, res))

export { commodityRouter }
