import express from 'express'
import { middleware } from '../../../../../shared/infra/http'
import { createOrderController } from '../../../useCases/order/createOrder'
import { getOrderListController } from '../../../useCases/order/getOrderList'
import { cancelOrderController } from '../../../useCases/order/cancelOrder'
import { paymentOrderController } from '../../../useCases/order/paymentOrder'
import { getOrderByIdController } from '../../../useCases/order/getOrderById'
import { shippedOrderController } from '../../../useCases/order/shippedOrder'
import { receivedOrderController } from '../../../useCases/order/receivedOrder'
import { autoCancelOrderController } from '../../../useCases/order/autoCancelOrder'
import { closeOrderController } from '../../../useCases/order/closeOrder'

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
