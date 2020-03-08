import express from 'express'
import { dailySignInController } from '../../../userCases/signIns/dailySignIn'
import { middleware } from '../../../../../shared/infra/http'

const signInRouter = express.Router()

signInRouter.post('/dailySignIn', middleware.ensureAuthenticated(), (req, res) =>
  dailySignInController.execute(req, res)
)

export { signInRouter }
