import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { Coupon } from '../../../domain/coupon'
import { GetCouponListDto } from './getCouponListDto'
import { ICouponRepo } from '../../../repos/couponRepo'

type Response = Either<AppError.UnexpectedError | Result<any>, Result<Coupon[]>>

export class GetCouponListUseCase implements UseCase<GetCouponListDto, Promise<Response>> {
  private couponRepo: ICouponRepo

  constructor(couponRepo: ICouponRepo) {
    this.couponRepo = couponRepo
  }

  public async execute(request: GetCouponListDto): Promise<Response> {
    try {
      // const {} = request

      const couponList = await this.couponRepo.filter()

      return right(Result.ok<Coupon[]>(couponList))
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
