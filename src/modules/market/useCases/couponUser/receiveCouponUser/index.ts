import { couponUserRepo, couponRepo } from '../../../repos'
import { ReceiveCouponUserUseCase } from './receiveCouponUserUseCase'
import { ReceiveCouponUserController } from './receiveCouponUserController'

const receiveCouponUserUseCase = new ReceiveCouponUserUseCase(couponUserRepo, couponRepo)
const receiveCouponUserController = new ReceiveCouponUserController(receiveCouponUserUseCase)

export { receiveCouponUserUseCase, receiveCouponUserController }
