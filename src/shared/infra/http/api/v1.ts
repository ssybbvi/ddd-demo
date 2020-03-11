import express from 'express'
import { tenantRouter } from '../../../../modules/tenants/infra/http/routes/tenant'
import { userRouter } from '../../../../modules/users/infra/http/routers/index'
import {
  signInRouter,
  memberRouter,
  fundRouter,
  fundAccountRouter
} from '../../../../modules/distribution/infra/http/routes/index'

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
export { v1Router }
