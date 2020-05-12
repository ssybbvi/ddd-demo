import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { ReceiveCouponDto } from './receiveCouponDto'
import { ICouponUserRepo } from '../../../repos/couponUserRepo'
import { ICouponRepo } from '../../../repos/couponRepo'
import { CouponUser } from '../../../domain/couponUser'

type Response = Either<AppError.UnexpectedError, Result<void>>

export class ReceiveCouponUseCase implements UseCase<ReceiveCouponDto, Promise<Response>> {
  private couponUserRepo: ICouponUserRepo
  private couponRepo: ICouponRepo

  constructor(couponUserRepo: ICouponUserRepo, couponRepo: ICouponRepo) {
    this.couponUserRepo = couponUserRepo
    this.couponRepo = couponRepo
  }

  public async execute(request: ReceiveCouponDto): Promise<Response> {
    try {
      const { userId, couponId } = request
      //const coupon = await this.couponRepo.getById(couponId)

      const couponUserOrError = CouponUser.create({
        userId,
        couponId
      })

      if (couponUserOrError.isFailure) {
        return left(couponUserOrError)
      }

      await this.couponUserRepo.save(couponUserOrError.getValue())

      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
