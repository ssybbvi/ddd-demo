import { UseCouponUserUseCase } from './useCouponUserUseCase'
import { couponUserRepo, couponRepo } from '../../../repos'

const useCouponUserUseCase = new UseCouponUserUseCase(couponUserRepo)
export { useCouponUserUseCase }
