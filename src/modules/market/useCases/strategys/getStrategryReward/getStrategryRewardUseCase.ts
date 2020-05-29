import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { IStrategyRepo } from '../../../repos/strategyRepo'
import { IGetStrategryRewardDto, IStrategyCommodityDto } from './getStrategryRewardDto'
import { ICouponRepo } from '../../../repos/couponRepo'
import { ICouponUserRepo } from '../../../repos/couponUserRepo'
import { NotFoundError } from '../../../../../shared/core/NotFoundError'
import { IStrategyConditon, Strategy } from '../../../domain/strategy'
import { ConditionDate } from '../../../domain/conditionDate'
import { ConditionCommodityStrategyTag } from '../../../domain/conditionCommodityStrategyTag'
import { ConditionCommodityQuantity } from '../../../domain/conditionCommodityQuantity'
import { ConditionCoupon } from '../../../domain/conditionCoupon'
import { ConditionAmount } from '../../../domain/conditionAmount'
import { StrategyCommodity } from '../../../domain/strategyCommodity'
import { ICommodityRepo } from '../../../../commoditys/repos/iCommodityRepo'

type Response = Either<AppError.UnexpectedError | NotFoundError | Result<StrategyCommodity>, Result<Strategy[]>>
type GetStrategyCommodityResponse = Either<
  AppError.UnexpectedError | NotFoundError | Result<any>,
  Result<StrategyCommodity>
>

export interface ISeniority {
  couponId: string
  strategyCommoditys: StrategyCommodity[]
}

export class GetStrategryRewardUseCase implements UseCase<IGetStrategryRewardDto, Promise<Response>> {
  private couponRepo: ICouponRepo
  private strategyRepo: IStrategyRepo
  private couponUserRepo: ICouponUserRepo
  private commodityRepo: ICommodityRepo

  constructor(
    couponRepo: ICouponRepo,
    strategyRepo: IStrategyRepo,
    couponUserRepo: ICouponUserRepo,
    commodityRepo: ICommodityRepo
  ) {
    this.couponRepo = couponRepo
    this.strategyRepo = strategyRepo
    this.couponUserRepo = couponUserRepo
    this.commodityRepo = commodityRepo
  }

  private condition(strategyConditons: IStrategyConditon[], seniority: ISeniority) {
    const { couponId, strategyCommoditys } = seniority

    const conditionDates = strategyConditons.filter((item) => item.type == 'date') as ConditionDate[]
    const conditionDateResult = conditionDates.every((item) => item.IsAvailable())
    if (!conditionDateResult) {
      return false
    }

    const commodityStrategyTags = strategyConditons.filter(
      (item) => item.type == 'commodityStrategyTag'
    ) as ConditionCommodityStrategyTag[]

    const commodityStrategyTagsResult = commodityStrategyTags.every((item) => item.IsAvailable(strategyCommoditys))
    if (!commodityStrategyTagsResult) {
      return false
    }

    const conditionCommodityQuantitys = strategyConditons.filter(
      (item) => item.type == 'commodityQuantity'
    ) as ConditionCommodityQuantity[]
    const conditionCommodityQuantitysResult = conditionCommodityQuantitys.every((item) =>
      item.IsAvailable(strategyCommoditys)
    )
    if (!conditionCommodityQuantitysResult) {
      return false
    }

    const conditionCoupons = strategyConditons.filter((item) => item.type == 'coupon') as ConditionCoupon[]
    const conditionCouponsResult = conditionCoupons.every((item) => item.IsAvailable(couponId))
    if (!conditionCouponsResult) {
      return false
    }

    const amountConditons = strategyConditons.filter((item) => item.type == 'amount') as ConditionAmount[]
    const amountConditonsResult = amountConditons.every((item) => item.IsAvailable(strategyCommoditys))
    if (!amountConditonsResult) {
      return false
    }

    return true
  }

  private async getStrategyCommodity(item: IStrategyCommodityDto): Promise<GetStrategyCommodityResponse> {
    const commodity = await this.commodityRepo.getById(item.commodityId)
    if (!commodity) {
      return left(new NotFoundError(`没有此商品${item.commodityId}`))
    }
    const sku = commodity.skus.getItems().find((findItem) => findItem.id.toString() == item.skuId)
    if (!sku) {
      return left(new NotFoundError(`没有此sku${item.skuId}`))
    }

    const strategyCommodityOrError = StrategyCommodity.create({
      name: commodity.name.value,
      commodityId: item.commodityId,
      skuId: item.skuId,
      type: commodity.type,
      strategyTag: commodity.strategyTags,
      amount: sku.price,
    })
    if (strategyCommodityOrError.isFailure) {
      return left(strategyCommodityOrError)
    }

    return right(Result.ok<StrategyCommodity>(strategyCommodityOrError.getValue()))
  }

  private getAvailableStrategyCommodityList(
    strategyConditons: IStrategyConditon[],
    strategyCommoditys: StrategyCommodity[]
  ): StrategyCommodity[] {
    const commodityStrategyTags = strategyConditons.filter(
      (item) => item.type == 'commodityStrategyTag'
    ) as ConditionCommodityStrategyTag[]

    if (commodityStrategyTags.length == 0) {
      return strategyCommoditys
    }

    return strategyCommoditys.filter((strategyCommoditysItem) => {
      return commodityStrategyTags.some((commodityStrategyTagItem) =>
        strategyCommoditysItem.strategyTag.includes(commodityStrategyTagItem.tag)
      )
    })
  }

  public async execute(request: IGetStrategryRewardDto): Promise<Response> {
    try {
      const { couponId, strategyCommodityDtoList, userId } = request

      if (couponId && userId) {
        const couponUser = await this.couponUserRepo.getByCouponIdWithUserIdAndUnused(userId, couponId)
        if (!couponUser) {
          return left(new NotFoundError('无此优惠券'))
        }
      }

      const strategyCommoditys: StrategyCommodity[] = []
      for (let item of strategyCommodityDtoList) {
        const strategyCommodityResult = await this.getStrategyCommodity(item)
        const strategyCommodityResultValue = strategyCommodityResult.value
        if (strategyCommodityResult.isLeft()) {
          return left(strategyCommodityResult.value)
        }
        strategyCommoditys.push(strategyCommodityResultValue.getValue())
      }

      const availableStrategys: Strategy[] = []

      //活动策略
      const strategyList = await this.strategyRepo.filter()
      for (let item of strategyList) {
        const availableStrategyCommodityList = await this.getAvailableStrategyCommodityList(
          item.condition,
          strategyCommoditys
        )
        const couponConditionResult = this.condition(item.condition, {
          couponId: couponId,
          strategyCommoditys: availableStrategyCommodityList,
        })
        if (couponConditionResult) {
          availableStrategys.push(item)
        }
      }

      return right(Result.ok<Strategy[]>(availableStrategys))
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
