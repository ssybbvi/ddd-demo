import express from 'express'
import { dailySignInController } from '../../../userCases/signIns/dailySignIn'
import { middleware } from '../../../../../shared/infra/http'
import { getRecentSignInController } from '../../../userCases/signIns/getRecentSignInList'
import { dailySuperSignInController } from '../../../userCases/signIns/dailySuperSignIn'

const signInRouter = express.Router()

signInRouter.post('/dailySignIn', middleware.ensureAuthenticated(), (req, res) =>
  dailySignInController.execute(req, res)
)

signInRouter.get('/recent', middleware.ensureAuthenticated(), (req, res) => getRecentSignInController.execute(req, res))

signInRouter.post('/dailySuperSignIn', middleware.ensureAuthenticated(), (req, res) =>
  dailySuperSignInController.execute(req, res)
)

export { signInRouter }
