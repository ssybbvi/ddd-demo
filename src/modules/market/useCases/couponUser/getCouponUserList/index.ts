import { couponUserRepo } from '../../../repos'
import { GetCouponUserListUseCase } from './getCouponUserListUseCase'
import { GetCouponUserListController } from './getCouponUserListController'

const getCouponUserListUseCase = new GetCouponUserListUseCase(couponUserRepo)
const getCouponUserListController = new GetCouponUserListController(getCouponUserListUseCase)

export { getCouponUserListUseCase, getCouponUserListController }
