import { AfterOrderCreated } from './afterOrderCreated'
import { useCouponUserUseCase } from '../useCases/couponUser/useCouponUser'

new AfterOrderCreated(useCouponUserUseCase)
