import express from 'express'
import { middleware } from '../../../../../shared/infra/http'
import { authorizationCodeController } from '../../../useCases/appUser/authorizationCode'

const appUserRouter = express.Router()

appUserRouter.get('/authorization', (req, res) => authorizationCodeController.execute(req, res))

export { appUserRouter }