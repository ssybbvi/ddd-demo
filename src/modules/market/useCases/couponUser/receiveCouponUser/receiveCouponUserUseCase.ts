import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { ReceiveCouponUserDto } from './receiveCouponUserDto'
import { ICouponUserRepo } from '../../../repos/couponUserRepo'
import { CouponUser } from '../../../domain/couponUser'

type Response = Either<AppError.UnexpectedError | Result<any>, Result<void>>

export class ReceiveCouponUserUseCase implements UseCase<ReceiveCouponUserDto, Promise<Response>> {
  private couponUserRepo: ICouponUserRepo

  constructor(couponUserRepo: ICouponUserRepo) {
    this.couponUserRepo = couponUserRepo
  }

  public async execute(request: ReceiveCouponUserDto): Promise<Response> {
    try {
      const { userId, couponId } = request

      const couponUserOrError = CouponUser.create({
        userId,
        couponId,
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
