import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { ConditionAmount } from '../../../domain/conditionAmount'
import { ConditionDate } from '../../../domain/conditionDate'
import { IStrategyRepo } from '../../../repos/strategyRepo'
import { IStrategyReward } from '../../../domain/strategy'
import { RewardCoupon } from '../../../domain/rewardCoupon'
import { RewardDiscount } from '../../../domain/rewardDiscount'
import { RewardGiveaway } from '../../../domain/rewardGiveaway'
import { RewardReliefAmount } from '../../../domain/rewardReliefAmount'
import { ConditionCommodityQuantity } from '../../../domain/conditionCommodityQuantity'
import { ConditionCommodityStrategyTag } from '../../../domain/conditionCommodityStrategyTag'
import { ConditionCoupon } from '../../../domain/conditionCoupon'
import { IUpdateStrategyDto } from './updateStrategyDto'

type Response = Either<AppError.UnexpectedError | Result<any>, Result<void>>

export class UpdateStrategyUseCase implements UseCase<IUpdateStrategyDto, Promise<Response>> {
  private strategyRepo: IStrategyRepo

  constructor(strategyRepo: IStrategyRepo) {
    this.strategyRepo = strategyRepo
  }

  public async execute(request: IUpdateStrategyDto): Promise<Response> {
    try {
      const { _id, name, condition, reward, description } = request

      let conditionList = []
      for (let item of condition) {
        if (item.type === 'amount') {
          const conditionAmountOrError = ConditionAmount.create({
            type: 'amount',
            amount: item.amount,
          })
          if (conditionAmountOrError.isFailure) {
            return left(conditionAmountOrError)
          }
          conditionList.push(conditionAmountOrError.getValue())
        } else if (item.type === 'date') {
          const conditionDateOrError = ConditionDate.create({
            type: 'date',
            beginAt: item.beginAt,
            finishAt: item.finishAt,
          })
          if (conditionDateOrError.isFailure) {
            return left(conditionDateOrError)
          }
          conditionList.push(conditionDateOrError.getValue())
        } else if (item.type === 'commodityQuantity') {
          const commodityQuantityOrError = ConditionCommodityQuantity.create({
            type: 'commodityQuantity',
            quantity: item.quantity,
          })
          if (commodityQuantityOrError.isFailure) {
            return left(commodityQuantityOrError)
          }
          conditionList.push(commodityQuantityOrError.getValue())
        } else if (item.type === 'commodityStrategyTag') {
          const conditionCommodityStrategyTagOrError = ConditionCommodityStrategyTag.create({
            type: 'commodityStrategyTag',
            tag: item.tag,
          })
          if (conditionCommodityStrategyTagOrError.isFailure) {
            return left(conditionCommodityStrategyTagOrError)
          }
          conditionList.push(conditionCommodityStrategyTagOrError.getValue())
        } else if (item.type === 'coupon') {
          const conditionCouponOrError = ConditionCoupon.create({
            type: 'coupon',
            couponId: item.couponId,
          })
          if (conditionCouponOrError.isFailure) {
            return left(conditionCouponOrError)
          }
          conditionList.push(conditionCouponOrError.getValue())
        }
      }

      let strategyReward: IStrategyReward
      if (reward.type == 'coupon') {
        const rewardCouponOrError = RewardCoupon.create({
          type: 'coupon',
          couponId: reward.couponId,
        })
        if (rewardCouponOrError.isFailure) {
          return left(rewardCouponOrError)
        }
        strategyReward = rewardCouponOrError.getValue()
      } else if (reward.type == 'discount') {
        const rewardDiscountOrError = RewardDiscount.create({
          type: 'discount',
          discount: reward.discount,
        })
        if (rewardDiscountOrError.isFailure) {
          return left(rewardDiscountOrError)
        }
        strategyReward = rewardDiscountOrError.getValue()
      } else if (reward.type == 'giveaway') {
        const rewardGiveawayOrError = RewardGiveaway.create({
          type: 'giveaway',
          commodityId: reward.commodityId,
        })
        if (rewardGiveawayOrError.isFailure) {
          return left(rewardGiveawayOrError)
        }
        strategyReward = rewardGiveawayOrError.getValue()
      } else if (reward.type == 'reliefAmount') {
        const rewardReliefAmountOrError = RewardReliefAmount.create({
          type: 'reliefAmount',
          reliefAmount: reward.reliefAmount,
        })
        if (rewardReliefAmountOrError.isFailure) {
          return left(rewardReliefAmountOrError)
        }
        strategyReward = rewardReliefAmountOrError.getValue()
      }

      const strategy = await this.strategyRepo.getById(_id)
      strategy.updateName(name)
      strategy.updateCondition(conditionList)
      strategy.updateDescription(description)
      strategy.updateReward(strategyReward)

      await this.strategyRepo.save(strategy)

      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
