import express from 'express'
import { middleware } from '../../../../../shared/infra/http'
import { createCommodityTagController } from '../../../userCases/commodityTag/createCommodityTag'
import { updateCommodityTagController } from '../../../userCases/commodityTag/updateCommodityTag'
import { getCommodityTagListController } from '../../../userCases/commodityTag/getCommodityTagList'


const commodityTagRouter = express.Router()

commodityTagRouter.post('/', (req, res) => createCommodityTagController.execute(req, res))
commodityTagRouter.get('/', (req, res) => getCommodityTagListController.execute(req, res))
commodityTagRouter.put('/', (req, res) => updateCommodityTagController.execute(req, res))

export { commodityTagRouter }
