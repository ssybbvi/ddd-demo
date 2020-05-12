import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { ICreateCouponDto } from './createCouponDto'
import { ICouponRepo } from '../../../repos/couponRepo'
import { Coupon } from '../../../domain/coupon'
import { CouponMap } from '../../../mappers/couponMap'
import { ConditionAmount } from '../../../domain/conditionAmount'
import { ConditionDate } from '../../../domain/conditionDate'
import { IConditionAmountDto } from '../../../dtos/conditionAmountDto'
import { IConditionDateDto } from '../../../dtos/conditionDateDto'
import { CreateCouponError } from './createCouponError'

type Response = Either<CreateCouponError.TypeNotFoundError | AppError.UnexpectedError, Result<void>>

export class CreateCouponUseCase implements UseCase<ICreateCouponDto, Promise<Response>> {
  private couponRepo: ICouponRepo

  constructor(couponRepo: ICouponRepo) {
    this.couponRepo = couponRepo
  }

  public async execute(request: ICreateCouponDto): Promise<Response> {
    try {
      const { name, condition, reward } = request

      let conditionList = []
      for (let item of condition) {
        if (item.type === 'amount') {
          item = item as IConditionAmountDto
          const conditionAmountOrError = ConditionAmount.create({
            type: 'amount',
            amount: item.amount
          })
          if (conditionAmountOrError.isFailure) {
            return left(conditionAmountOrError)
          }
          conditionList.push(conditionAmountOrError.getValue())
        } else if (item.type === 'date') {
          item = item as IConditionDateDto
          const conditionDateOrError = ConditionDate.create({
            type: 'date',
            beginAt: item.beginAt,
            finishAt: item.finishAt
          })
          if (conditionDateOrError.isFailure) {
            return left(conditionDateOrError)
          }
          conditionList.push(conditionDateOrError.getValue())
        } else {
          return left(new CreateCouponError.TypeNotFoundError(item.type))
        }
      }


      const rewards = CouponMap.toRewardDomain(reward)//TODO
      const couponOrError = Coupon.create({
        name: name,
        condition: conditionList,
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
