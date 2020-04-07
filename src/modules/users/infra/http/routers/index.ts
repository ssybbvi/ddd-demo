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
const userRouter = express.Router()

userRouter.get('/me', middleware.ensureAuthenticated(), (req, res) => getCurrentUserController.execute(req, res))

userRouter.get('/admin/me', middleware.ensureAuthenticated(), (req, res) => adminAboutMeController.execute(req, res))

userRouter.post('/logout', middleware.ensureAuthenticated(), (req, res) => logoutController.execute(req, res))

userRouter.post('/token/refresh', (req, res) => refreshAccessTokenController.execute(req, res))

userRouter.delete('/:userId', middleware.ensureAuthenticated(), (req, res) => deleteUserController.execute(req, res))

userRouter.get('/:username', middleware.ensureAuthenticated(), (req, res) =>
  getUserByUserNameController.execute(req, res)
)

userRouter.post('/wx/authorization', (req, res) => wxAuthorizationController.execute(req, res))

userRouter.get('/wx/me', middleware.ensureAuthenticated(), (req, res) => getWxCurrentUserController.execute(req, res))

userRouter.post('/test/login', (req, res) => testLoginController.execute(req, res))

userRouter.put('/bindingPhoneNumber', middleware.ensureAuthenticated(), (req, res) =>
  bindingPhoneNumberController.execute(req, res)
)

export { userRouter }
