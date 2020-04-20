import express from 'express'
import { middleware } from '../../../../../shared/infra/http'
import { createThirdPartyAppController } from '../../../useCases/thirdPartyApp/createThirdPartyApp'
import { getTokenController } from '../../../useCases/thirdPartyApp/getToken'

const thirdPartyAppRouter = express.Router()

thirdPartyAppRouter.post('/', (req, res) => createThirdPartyAppController.execute(req, res))
thirdPartyAppRouter.get('/', (req, res) => getTokenController.execute(req, res))
export { thirdPartyAppRouter }