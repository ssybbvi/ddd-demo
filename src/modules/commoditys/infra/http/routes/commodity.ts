import express from 'express'
import { middleware } from '../../../../../shared/infra/http'
import { createCommodityController } from '../../../userCases/craeteCommodity'
import { getCommodityController } from '../../../userCases/getCommodity'
import {getCommodityByIdController} from '../../../userCases/getCommodityById'
import {editCommodityController} from '../../../userCases/editCommodity'

const commodityRouter = express.Router()

commodityRouter.post('/', (req, res) => createCommodityController.execute(req, res))
commodityRouter.get('/:commodityId', (req, res) => getCommodityByIdController.execute(req, res))
commodityRouter.get('/', (req, res) => getCommodityController.execute(req, res))
commodityRouter.put('/', (req, res) => editCommodityController.execute(req, res))

export { commodityRouter }
