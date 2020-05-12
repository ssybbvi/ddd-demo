import { UseCouponUseCase } from "./useCouponUseCase"
import { couponUserRepo, couponRepo } from "../../../repos"

const useCouponUseCase = new UseCouponUseCase(couponUserRepo, couponRepo)
export { useCouponUseCase }