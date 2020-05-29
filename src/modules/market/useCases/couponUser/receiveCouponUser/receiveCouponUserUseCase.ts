import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { ReceiveCouponUserDto } from './receiveCouponUserDto'
import { ICouponUserRepo } from '../../../repos/couponUserRepo'
import { CouponUser } from '../../../domain/couponUser'
import { ICouponRepo } from '../../../repos/couponRepo'
import { NotFoundError } from '../../../../../shared/core/NotFoundError'

type Response = Either<AppError.UnexpectedError | NotFoundError | Result<any>, Result<void>>

export class ReceiveCouponUserUseCase implements UseCase<ReceiveCouponUserDto, Promise<Response>> {
  private couponUserRepo: ICouponUserRepo
  private couponRepo: ICouponRepo

  constructor(couponUserRepo: ICouponUserRepo, couponRepo: ICouponRepo) {
    this.couponUserRepo = couponUserRepo
    this.couponRepo = couponRepo
  }

  public async execute(request: ReceiveCouponUserDto): Promise<Response> {
    try {
      const { userId, couponId } = request

      const coupon = await this.couponRepo.getById(couponId)
      if (!coupon) {
        return left(new NotFoundError(`没有此优惠券：${couponId}`))
      }

      const couponUserList = await this.couponUserRepo.filter(userId)
      const receiveCouponTotal = couponUserList.filter((item) => item.couponId == couponId).length

      const receiveResult = coupon.receive(receiveCouponTotal)
      if (receiveResult.isLeft()) {
        return left(receiveResult.value)
      }

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
