import express from 'express'
import { middleware } from '../../../../../shared/infra/http'
import { getCouponUserListController } from '../../../useCases/couponUser/getCouponUserList'
import { receiveCouponUserController } from '../../../useCases/couponUser/receiveCouponUser'

const couponUserRouter = express.Router()

couponUserRouter.get('/', middleware.ensureAuthenticated(), (req, res) => getCouponUserListController.execute(req, res))
couponUserRouter.post('/receive', middleware.ensureAuthenticated(), (req, res) =>
  receiveCouponUserController.execute(req, res)
)

export { couponUserRouter }
