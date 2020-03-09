import express from 'express'
import { getDistributionMemberController } from '../../../userCases/members/getDistributionMember'
import { middleware } from '../../../../../shared/infra/http'

const memberRouter = express.Router()

memberRouter.get('/getDistributionMember', middleware.ensureAuthenticated(), (req, res) =>
  getDistributionMemberController.execute(req, res)
)

export { memberRouter }
