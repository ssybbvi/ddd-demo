import express from 'express'
import { middleware } from '../../../../../shared/infra/http'
import { createThirdPartyAppController } from '../../../useCases/thirdPartyApp/createThirdPartyApp'
import { getTokenController } from '../../../useCases/thirdPartyApp/getToken'

const thirdPartyAppRouter = express.Router()

thirdPartyAppRouter.post('/', middleware.ensureAuthenticated(), (req, res) => createThirdPartyAppController.execute(req, res))
thirdPartyAppRouter.get('/', middleware.ensureAuthenticated(), (req, res) => getTokenController.execute(req, res))
export { thirdPartyAppRouter }