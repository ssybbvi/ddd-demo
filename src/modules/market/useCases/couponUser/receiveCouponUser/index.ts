import { couponUserRepo } from '../../../repos'
import { ReceiveCouponUserUseCase } from './receiveCouponUserUseCase'
import { ReceiveCouponUserController } from './receiveCouponUserController'

const receiveCouponUserUseCase = new ReceiveCouponUserUseCase(couponUserRepo)
const receiveCouponUserController = new ReceiveCouponUserController(receiveCouponUserUseCase)

export { receiveCouponUserUseCase, receiveCouponUserController }
