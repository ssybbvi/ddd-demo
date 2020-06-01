import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { IStrategyCommodityDto, IGetActivityRewardDto } from './getActivityRewardDto'
import { ICouponRepo } from '../../../repos/couponRepo'
import { ICouponUserRepo } from '../../../repos/couponUserRepo'
import { NotFoundError } from '../../../../../shared/core/NotFoundError'
import { IStrategyConditon, Strategy } from '../../../domain/strategy'
import { ConditionDate } from '../../../domain/conditionDate'
import { ConditionCommodityStrategyTag } from '../../../domain/conditionCommodityStrategyTag'
import { ConditionCommodityQuantity } from '../../../domain/conditionCommodityQuantity'
import { ConditionCoupon } from '../../../domain/conditionCoupon'
import { ConditionAmount } from '../../../domain/conditionAmount'
import { ICommodityRepo } from '../../../../commoditys/repos/iCommodityRepo'
import { CommodityItem } from '../../../../orders/domain/commodityItem'
import { CommodityType } from '../../../../commoditys/domain/commodityType'
import { RewardDiscount } from '../../../domain/rewardDiscount'
import { IActivityRepo } from '../../../repos/activityRepo'

type Response = Either<AppError.UnexpectedError | NotFoundError | Result<CommodityItem>, Result<Strategy[]>>
type GetCommodityItemResponse = Either<AppError.UnexpectedError | NotFoundError | Result<any>, Result<CommodityItem>>

export interface ISeniority {
  couponId: string
  commodityItems: CommodityItem[]
}

export class GetActivityRewardUseCase implements UseCase<IGetActivityRewardDto, Promise<Response>> {
  private couponRepo: ICouponRepo
  private activityRepo: IActivityRepo
  private couponUserRepo: ICouponUserRepo
  private commodityRepo: ICommodityRepo

  constructor(
    couponRepo: ICouponRepo,
    activityRepo: IActivityRepo,
    couponUserRepo: ICouponUserRepo,
    commodityRepo: ICommodityRepo
  ) {
    this.couponRepo = couponRepo
    this.activityRepo = activityRepo
    this.couponUserRepo = couponUserRepo
    this.commodityRepo = commodityRepo
  }

  private condition(strategyConditons: IStrategyConditon[], seniority: ISeniority) {
    const { couponId, commodityItems } = seniority

    const conditionDates = strategyConditons.filter((item) => item.type == 'date') as ConditionDate[]
    const conditionDateResult = conditionDates.every((item) => item.IsAvailable())
    if (!conditionDateResult) {
      return false
    }

    const commodityStrategyTags = strategyConditons.filter(
      (item) => item.type == 'commodityStrategyTag'
    ) as ConditionCommodityStrategyTag[]

    const commodityStrategyTagsResult = commodityStrategyTags.every((item) => item.IsAvailable(commodityItems))
    if (!commodityStrategyTagsResult) {
      return false
    }

    const conditionCommodityQuantitys = strategyConditons.filter(
      (item) => item.type == 'commodityQuantity'
    ) as ConditionCommodityQuantity[]
    const conditionCommodityQuantitysResult = conditionCommodityQuantitys.every((item) =>
      item.IsAvailable(commodityItems)
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
    const amountConditonsResult = amountConditons.every((item) => item.IsAvailable(commodityItems))
    if (!amountConditonsResult) {
      return false
    }

    return true
  }

  private async getCommodityItem(item: IStrategyCommodityDto): Promise<GetCommodityItemResponse> {
    const commodity = await this.commodityRepo.getById(item.commodityId)
    if (!commodity) {
      return left(new NotFoundError(`没有此商品${item.commodityId}`))
    }
    const sku = commodity.skus.getItems().find((findItem) => findItem.id.toString() == item.skuId)
    if (!sku) {
      return left(new NotFoundError(`没有此sku${item.skuId}`))
    }

    const commodityItemOrError = CommodityItem.create({
      name: commodity.name.value,
      commodityId: item.commodityId,
      skuId: item.skuId,
      commodityType: commodity.type as CommodityType,
      strategyTags: commodity.strategyTags,
      amount: sku.price,
      specifications: '',
    })
    if (commodityItemOrError.isFailure) {
      return left(commodityItemOrError)
    }

    return right(Result.ok<CommodityItem>(commodityItemOrError.getValue()))
  }

  private getAvailableCommodityItemList(
    strategyConditons: IStrategyConditon[],
    commodityItems: CommodityItem[]
  ): CommodityItem[] {
    const commodityStrategyTags = strategyConditons.filter(
      (item) => item.type == 'commodityStrategyTag'
    ) as ConditionCommodityStrategyTag[]

    if (commodityStrategyTags.length == 0) {
      return commodityItems
    }

    return commodityItems.filter((commodityItemsItem) => {
      return commodityStrategyTags.some((commodityStrategyTagItem) =>
        commodityItemsItem.strategyTags.includes(commodityStrategyTagItem.tag)
      )
    })
  }

  public async execute(request: IGetActivityRewardDto): Promise<Response> {
    try {
      const { couponId, strategyCommodityDtoList, userId } = request

      if (couponId && userId) {
        const couponUser = await this.couponUserRepo.getByCouponIdWithUserIdAndUnused(userId, couponId)
        if (!couponUser) {
          return left(new NotFoundError('无此优惠券'))
        }
      }

      const commodityItems: CommodityItem[] = []
      for (let item of strategyCommodityDtoList) {
        const commodityItemResult = await this.getCommodityItem(item)
        const commodityItemResultValue = commodityItemResult.value
        if (commodityItemResult.isLeft()) {
          return left(commodityItemResult.value)
        }
        commodityItems.push(commodityItemResultValue.getValue())
      }

      const availableStrategys: Strategy[] = []

      //活动策略
      const activityList = await this.activityRepo.filterByEnable()

      for (let item of activityList) {
        const availableCommodityItemList = await this.getAvailableCommodityItemList(
          item.strategy.condition,
          commodityItems
        )
        const couponConditionResult = this.condition(item.strategy.condition, {
          couponId: couponId,
          commodityItems: availableCommodityItemList,
        })
        if (item.strategy.reward.type == 'discount') {
          const totalAmount = availableCommodityItemList.reduce((acc, item) => (acc += item.amount), 0)
          const rewardDiscount = item.strategy.reward as RewardDiscount
          rewardDiscount.setRewardDiscountAmount(totalAmount)
        }
        if (couponConditionResult) {
          availableStrategys.push(item.strategy)
        }
      }

      return right(Result.ok<Strategy[]>(availableStrategys))
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
