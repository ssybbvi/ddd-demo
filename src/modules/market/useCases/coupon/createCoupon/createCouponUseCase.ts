import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { ICreateCouponDto } from './createCouponDto'
import { ICouponRepo } from '../../../repos/couponRepo'
import { Coupon } from '../../../domain/coupon'
import { CouponMap } from '../../../mappers/couponMap'

type Response = Either<AppError.UnexpectedError, Result<void>>

export class CreateCouponUseCase implements UseCase<ICreateCouponDto, Promise<Response>> {
  private couponRepo: ICouponRepo

  constructor(couponRepo: ICouponRepo) {
    this.couponRepo = couponRepo
  }

  public async execute(request: ICreateCouponDto): Promise<Response> {
    try {
      const { name, condition, reward } = request

      const conditions = CouponMap.toConditionDomain(condition)
      const rewards = CouponMap.toRewardDomain(reward)
      const couponOrError = Coupon.create({
        name: name,
        condition: conditions,
        reward: rewards
      })

      if (couponOrError.isFailure) {
        return left(couponOrError)
      }

      await this.couponRepo.save(couponOrError.getValue())

      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
