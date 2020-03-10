import express from 'express'
import { getFundListController } from '../../../userCases/funds/getFundList'
import { middleware } from '../../../../../shared/infra/http'

const fundRouter = express.Router()

fundRouter.get('/', middleware.ensureAuthenticated(), (req, res) => getFundListController.execute(req, res))

export { fundRouter }
