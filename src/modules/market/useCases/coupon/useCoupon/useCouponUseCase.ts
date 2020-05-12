import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { ICouponUserRepo } from '../../../repos/couponUserRepo'
import { ICouponRepo } from '../../../repos/couponRepo'
import { IUseCouponDto } from './useCouponDto'
import { NotFoundError } from '../../../../../shared/core/NotFoundError'

type Response = Either<NotFoundError | AppError.UnexpectedError, Result<void>>

export class UseCouponUseCase implements UseCase<IUseCouponDto, Promise<Response>> {
  private couponUserRepo: ICouponUserRepo
  private couponRepo: ICouponRepo

  constructor(couponUserRepo: ICouponUserRepo, couponRepo: ICouponRepo) {
    this.couponUserRepo = couponUserRepo
    this.couponRepo = couponRepo
  }

  public async execute(request: IUseCouponDto): Promise<Response> {
    try {
      const { userId, couponId } = request
      const couponUser = await this.couponUserRepo.getByCouponIdWithUserIdAndUnused(userId, couponId)
      if (!couponUser) {
        return left(new NotFoundError(`无法找到可用的优惠券`))
      }

      couponUser.use()
      await this.couponUserRepo.save(couponUser)

      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
