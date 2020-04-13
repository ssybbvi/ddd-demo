import express from 'express'
import { middleware } from '../../../../../shared/infra/http'
import { createOrderController } from '../../../userCases/order/createOrder'
import { getOrderListController } from '../../../userCases/order/getOrderList'
import { cancelOrderController } from '../../../userCases/order/cancelOrder'
import { paymentOrderController } from '../../../userCases/order/paymentOrder'
import { getOrderByIdController } from '../../../userCases/order/getOrderById'
import { shippedOrderController } from '../../../userCases/order/shippedOrder'
import { receivedOrderController } from '../../../userCases/order/receivedOrder'
import { autoCancelOrderController } from '../../../userCases/order/autoCancelOrder'
import { closeOrderController } from '../../../userCases/order/closeOrder'

const orderRouter = express.Router()

orderRouter.post('/', middleware.ensureAuthenticated(), (req, res) => createOrderController.execute(req, res))
orderRouter.get('/temp', (req, res) => getOrderListController.execute(req, res))
orderRouter.get('/:orderId', (req, res) => getOrderByIdController.execute(req, res))
orderRouter.get('/', middleware.ensureAuthenticated(), (req, res) => getOrderListController.execute(req, res))
orderRouter.get('/auto/cancel', (req, res) => autoCancelOrderController.execute(req, res))
orderRouter.put('/payment', middleware.ensureAuthenticated(), (req, res) => paymentOrderController.execute(req, res))
orderRouter.put('/shipped', (req, res) => shippedOrderController.execute(req, res))
orderRouter.put('/received', (req, res) => receivedOrderController.execute(req, res))
orderRouter.put('/cancel', (req, res) => cancelOrderController.execute(req, res))
orderRouter.put('/close', (req, res) => closeOrderController.execute(req, res))
export { orderRouter }
