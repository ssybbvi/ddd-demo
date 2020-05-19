import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { ICouponUserRepo } from '../../../repos/couponUserRepo'
import { NotFoundError } from '../../../../../shared/core/NotFoundError'
import { IUseCouponUserDto } from './useCouponUserDto'

type Response = Either<NotFoundError | AppError.UnexpectedError, Result<void>>

export class UseCouponUserUseCase implements UseCase<IUseCouponUserDto, Promise<Response>> {
  private couponUserRepo: ICouponUserRepo

  constructor(couponUserRepo: ICouponUserRepo) {
    this.couponUserRepo = couponUserRepo
  }

  public async execute(request: IUseCouponUserDto): Promise<Response> {
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
