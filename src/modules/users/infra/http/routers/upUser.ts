import express from 'express'
import { middleware } from '../../../../../shared/infra/http'
import { getUpCurrentUserController } from '../../../useCases/upUser/getUpCurrentUser'
import { upAuthorizationController } from '../../../useCases/upUser/upAuthorization'
import { createUpUserController } from '../../../useCases/upUser/createUpUser'

const upUserRouter = express.Router()


upUserRouter.post('/', (req, res) => createUpUserController.execute(req, res))

upUserRouter.post('/authorization', (req, res) => upAuthorizationController.execute(req, res))

upUserRouter.get('admin/me', middleware.ensureAuthenticated(), (req, res) =>
  getUpCurrentUserController.execute(req, res)
)


export { upUserRouter }





