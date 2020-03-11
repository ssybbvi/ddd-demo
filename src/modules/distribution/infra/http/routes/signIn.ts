import express from 'express'
import { dailySignInController } from '../../../userCases/signIns/dailySignIn'
import { middleware } from '../../../../../shared/infra/http'
import { getRecentSignInController } from '../../../userCases/signIns/getRecentSignInList'

const signInRouter = express.Router()

signInRouter.post('/dailySignIn', middleware.ensureAuthenticated(), (req, res) =>
  dailySignInController.execute(req, res)
)

signInRouter.get('/recent', middleware.ensureAuthenticated(), (req, res) => getRecentSignInController.execute(req, res))
export { signInRouter }
