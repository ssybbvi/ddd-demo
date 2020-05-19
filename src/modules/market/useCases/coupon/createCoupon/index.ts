import { couponRepo } from '../../../repos'
import { CreateCouponUseCase } from './createCouponUseCase'
import { CreateCouponController } from './createCouponController'

const createCouponUseCase = new CreateCouponUseCase(couponRepo)
const createCouponController = new CreateCouponController(createCouponUseCase)

export { createCouponUseCase, createCouponController }
