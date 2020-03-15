import express from 'express'
import { getFundAccountController } from '../../../userCases/fundAccounts/getFundAccount'
import { middleware } from '../../../../../shared/infra/http'

const fundAccountRouter = express.Router()

fundAccountRouter.get('/', middleware.ensureAuthenticated(), (req, res) => getFundAccountController.execute(req, res))

export { fundAccountRouter }
