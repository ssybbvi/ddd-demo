import express from 'express'
import { middleware } from '../../../../../shared/infra/http'
import { createOrderController } from '../../../userCases/createOrder'
import { getOrderListController } from '../../../userCases/getOrderList'
import { cancelOrderController } from '../../../userCases/cancelOrder'
import { paymentOrderController } from '../../../userCases/paymentOrder'
import { getOrderByIdController } from '../../../userCases/getOrderById'
import { shippedOrderController } from '../../../userCases/shippedOrder'
import { receivedOrderController } from '../../../userCases/receivedOrder'

const orderRouter = express.Router()

orderRouter.post('/', middleware.ensureAuthenticated(), (req, res) => createOrderController.execute(req, res))
orderRouter.get('/temp', (req, res) => getOrderListController.execute(req, res))
orderRouter.get('/:orderId', (req, res) => getOrderByIdController.execute(req, res))
orderRouter.get('/', middleware.ensureAuthenticated(), (req, res) => getOrderListController.execute(req, res))
orderRouter.get('/auto/cancel', (req, res) => cancelOrderController.execute(req, res))
orderRouter.put('/payment', middleware.ensureAuthenticated(), (req, res) => paymentOrderController.execute(req, res))
orderRouter.put('/shipped', (req, res) => shippedOrderController.execute(req, res))
orderRouter.put('/received', (req, res) => receivedOrderController.execute(req, res))
export { orderRouter }
