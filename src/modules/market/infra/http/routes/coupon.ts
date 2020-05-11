import express from 'express'
import { middleware } from '../../../../../shared/infra/http'
import { createCouponController } from '../../../useCases/coupon/createCoupon'



const couponRouter = express.Router()

couponRouter.post('/', middleware.ensureAuthenticated(), (req, res) => createCouponController.execute(req, res))

export { couponRouter }


