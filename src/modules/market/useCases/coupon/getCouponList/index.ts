import { couponRepo } from '../../../repos'
import { GetCouponListUseCase } from './getCouponListUseCase'
import { GetCouponListController } from './getCouponListController'

console.log('zzzzzz========', couponRepo)
const getCouponListUseCase = new GetCouponListUseCase(couponRepo)
const getCouponListController = new GetCouponListController(getCouponListUseCase)

export { getCouponListUseCase, getCouponListController }
