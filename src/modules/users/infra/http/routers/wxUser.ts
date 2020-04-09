import express from 'express'
import { deleteUserController } from '../../../useCases/user/deleteUser'
import { getUserByUserNameController } from '../../../useCases/user/getUserByUserName'
import { middleware } from '../../../../../shared/infra/http'
import { getCurrentUserController } from '../../../useCases/user/getCurrentUser'
import { refreshAccessTokenController } from '../../../useCases/user/refreshAccessToken'
import { logoutController } from '../../../useCases/user/logout'
import { wxAuthorizationController } from '../../../useCases/wxUser/wxAuthorization'
import { getWxCurrentUserController } from '../../../useCases/wxUser/getWxCurrentUser'
import { testLoginController } from '../../../useCases/user/testLogin'
import { adminAboutMeController } from '../../../useCases/upUser/adminAboutMe'
import { bindingPhoneNumberController } from '../../../useCases/wxUser/bindingPhoneNumber'
import { bindindUseInfoController } from '../../../useCases/wxUser/bindindUseInfo'
const wxUserRouter = express.Router()


wxUserRouter.post('/authorization', (req, res) => wxAuthorizationController.execute(req, res))

wxUserRouter.get('/me', middleware.ensureAuthenticated(), (req, res) => getWxCurrentUserController.execute(req, res))

wxUserRouter.put('/bindingPhoneNumber', middleware.ensureAuthenticated(), (req, res) =>
  bindingPhoneNumberController.execute(req, res)
)

wxUserRouter.put('/bindindUseInfo', middleware.ensureAuthenticated(), (req, res) =>
  bindindUseInfoController.execute(req, res)
)

export { wxUserRouter }
