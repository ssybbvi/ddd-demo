import express from 'express'
import { tenantRouter } from '../../../../modules/tenants/infra/http/routes/tenant'
import { userRouter } from '../../../../modules/users/infra/http/routers/index'
import { signInRouter, memberRouter } from '../../../../modules/distribution/infra/http/routes/index'
import { fundRouter, fundAccountRouter } from '../../../../modules/funds/infra/http/routes'
import { commodityRouter } from '../../../../modules/commoditys/infra/http/routes'
import { orderRouter } from '../../../../modules/orders/infra/http/routes'

const v1Router = express.Router()

v1Router.get('/', (req, res) => {
  return res.json({ message: "Yo! we're up" })
})
v1Router.use('/users', userRouter)
v1Router.use('/tenant', tenantRouter)
v1Router.use('/signIn', signInRouter)
v1Router.use('/member', memberRouter)
v1Router.use('/fund', fundRouter)
v1Router.use('/fundAccount', fundAccountRouter)
v1Router.use('/commodity', commodityRouter)
v1Router.use('/order',orderRouter)
export { v1Router }
