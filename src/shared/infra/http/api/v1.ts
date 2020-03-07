import express from 'express'
import { tenantRouter } from '../../../../modules/tenants/infra/http/routes/tenant'
import { userRouter } from '../../../../modules/users/infra/http/routers/index'

const v1Router = express.Router()

v1Router.get('/', (req, res) => {
  return res.json({ message: "Yo! we're up" })
})
v1Router.use('/users', userRouter)
v1Router.use('/tenant', tenantRouter)

export { v1Router }
