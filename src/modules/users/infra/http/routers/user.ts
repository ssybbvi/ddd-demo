import express from 'express'
import { deleteUserController } from '../../../useCases/user/deleteUser'
import { getUserByUserNameController } from '../../../useCases/user/getUserByUserName'
import { middleware } from '../../../../../shared/infra/http'
import { getCurrentUserController } from '../../../useCases/user/getCurrentUser'
import { refreshAccessTokenController } from '../../../useCases/user/refreshAccessToken'
import { logoutController } from '../../../useCases/user/logout'
import { testLoginController } from '../../../useCases/user/testLogin'
import { recommendedByInviteTokenController } from '../../../useCases/user/recommendedByInviteToken'
const userRouter = express.Router()

userRouter.get('/me', middleware.ensureAuthenticated(), (req, res) => getCurrentUserController.execute(req, res))
userRouter.post('/logout', middleware.ensureAuthenticated(), (req, res) => logoutController.execute(req, res))
userRouter.post('/token/refresh', (req, res) => refreshAccessTokenController.execute(req, res))
userRouter.delete('/:userId', middleware.ensureAuthenticated(), (req, res) => deleteUserController.execute(req, res))
userRouter.get('/:username', middleware.ensureAuthenticated(), (req, res) =>
  getUserByUserNameController.execute(req, res)
)
userRouter.put('/recommended', middleware.ensureAuthenticated(), (req, res) => recommendedByInviteTokenController.execute(req, res))
userRouter.post('/test/login', (req, res) => testLoginController.execute(req, res))

export { userRouter }
