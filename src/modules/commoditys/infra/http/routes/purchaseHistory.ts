import express from 'express'
import { getPurchaseHistoryController } from '../../../userCases/purchaseHistory/getPurchaseHistory'

const purchaseHistoryRouter = express.Router()
purchaseHistoryRouter.get('/:commodityId', (req, res) => getPurchaseHistoryController.execute(req, res))
export { purchaseHistoryRouter }
