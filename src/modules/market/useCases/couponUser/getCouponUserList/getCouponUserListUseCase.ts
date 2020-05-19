import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { ICouponUserRepo } from '../../../repos/couponUserRepo'
import { CouponUser } from '../../../domain/couponUser'
import { GetCouponUserListDto } from './getCouponUserListDto'

type Response = Either<AppError.UnexpectedError, Result<CouponUser[]>>

export class GetCouponUserListUseCase implements UseCase<GetCouponUserListDto, Promise<Response>> {
  private couponUserRepo: ICouponUserRepo

  constructor(couponUserRepo: ICouponUserRepo) {
    this.couponUserRepo = couponUserRepo
  }

  public async execute(request: GetCouponUserListDto): Promise<Response> {
    try {
      const { userId } = request
      const couponUserList = await this.couponUserRepo.filter(userId)

      return right(Result.ok<CouponUser[]>(couponUserList))
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
