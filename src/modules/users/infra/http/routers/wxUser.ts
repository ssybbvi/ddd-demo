import express from 'express'
import { middleware } from '../../../../../shared/infra/http'
import { wxAuthorizationController } from '../../../useCases/wxUser/wxAuthorization'
import { getWxCurrentUserController } from '../../../useCases/wxUser/getWxCurrentUser'
import { bindingPhoneNumberController } from '../../../useCases/wxUser/bindingPhoneNumber'
import { bindindUseInfoController } from '../../../useCases/wxUser/bindindUseInfo'
import { getListController } from '../../../useCases/wxUser/getList'

const wxUserRouter = express.Router()

wxUserRouter.get('/', middleware.ensureAuthenticated(), (req, res) => getListController.execute(req, res))

wxUserRouter.post('/authorization', (req, res) => wxAuthorizationController.execute(req, res))

wxUserRouter.get('/me', middleware.ensureAuthenticated(), (req, res) => getWxCurrentUserController.execute(req, res))

wxUserRouter.put('/bindingPhoneNumber', middleware.ensureAuthenticated(), (req, res) =>
  bindingPhoneNumberController.execute(req, res)
)

wxUserRouter.put('/bindindUseInfo', middleware.ensureAuthenticated(), (req, res) =>
  bindindUseInfoController.execute(req, res)
)


export { wxUserRouter }
