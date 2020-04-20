import express from 'express'
import { createAuthCodeController } from '../../../useCases/authCode/createAuthCode'
import { middleware } from '../../../../../shared/infra/http'

const authCodeRouter = express.Router()

authCodeRouter.get('/', middleware.ensureAuthenticated(), (req, res) => createAuthCodeController.execute(req, res))

export { authCodeRouter }