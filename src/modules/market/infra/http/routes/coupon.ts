import express from 'express'
import { middleware } from '../../../../../shared/infra/http'
import { createCouponController } from '../../../useCases/coupon/createCoupon'
import { getCouponListController } from '../../../useCases/coupon/getCouponList'

const couponRouter = express.Router()

couponRouter.get('/', middleware.ensureAuthenticated(), (req, res) => getCouponListController.execute(req, res))
couponRouter.post('/', middleware.ensureAuthenticated(), (req, res) => createCouponController.execute(req, res))
export { couponRouter }
