import express from 'express'
import { getDistributionRecommendedUserController } from '../../../userCases/recommendedUsers/getDistributionRecommendedUser'
import { middleware } from '../../../../../shared/infra/http'

const recommendedUserRouter = express.Router()

recommendedUserRouter.get('/getDistributionRecommendedUser', middleware.ensureAuthenticated(), (req, res) =>
  getDistributionRecommendedUserController.execute(req, res)
)

export { recommendedUserRouter }
