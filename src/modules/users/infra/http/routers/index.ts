import express from 'express'
import { deleteUserController } from '../../../useCases/deleteUser'
import { getUserByUserNameController } from '../../../useCases/getUserByUserName'
import { middleware } from '../../../../../shared/infra/http'
import { getCurrentUserController } from '../../../useCases/getCurrentUser'
import { refreshAccessTokenController } from '../../../useCases/refreshAccessToken'
import { logoutController } from '../../../useCases/logout'
import { wxAuthorizationController } from '../../../useCases/wxAuthorization'
import { getWxCurrentUserController } from '../../../useCases/getWxCurrentUser'

const userRouter = express.Router()

userRouter.get('/me', middleware.ensureAuthenticated(), (req, res) => getCurrentUserController.execute(req, res))

userRouter.post('/logout', middleware.ensureAuthenticated(), (req, res) => logoutController.execute(req, res))

userRouter.post('/token/refresh', (req, res) => refreshAccessTokenController.execute(req, res))

userRouter.delete('/:userId', middleware.ensureAuthenticated(), (req, res) => deleteUserController.execute(req, res))

userRouter.get('/:username', middleware.ensureAuthenticated(), (req, res) =>
  getUserByUserNameController.execute(req, res)
)

userRouter.post('/wx/authorization', (req, res) => wxAuthorizationController.execute(req, res))

userRouter.get('/wx/me', middleware.ensureAuthenticated(), (req, res) => getWxCurrentUserController.execute(req, res))

export { userRouter }
