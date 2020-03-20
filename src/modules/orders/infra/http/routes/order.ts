import express from 'express'
import { middleware } from '../../../../../shared/infra/http'
import { createOrderController } from '../../../userCases/createOrder'
import { getOrderListController } from '../../../userCases/getOrderList'
import { cancelOrderController } from '../../../userCases/cancelOrder'
import { paymentOrderController } from '../../../userCases/paymentOrder'
import { getOrderByIdController } from '../../../userCases/getOrderById'

const orderRouter = express.Router()

orderRouter.post('/', middleware.ensureAuthenticated(),(req, res) => createOrderController.execute(req, res))
orderRouter.get('/:orderId', middleware.ensureAuthenticated(),(req, res) => getOrderByIdController.execute(req, res))
orderRouter.get('/', middleware.ensureAuthenticated(),(req, res) => getOrderListController.execute(req, res))
orderRouter.get('/auto/cancel', (req, res) => cancelOrderController.execute(req, res))
orderRouter.put('/payment', middleware.ensureAuthenticated(),(req, res) => paymentOrderController.execute(req, res))
export { orderRouter }
