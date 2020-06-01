import { ConditionAmountMap } from './conditionAmountMap'
import { IMapper } from '../../../shared/infra/Mapper'
import { Strategy, IStrategyConditon, IStrategyReward } from '../domain/strategy'
import { IStrategyDto } from '../dtos/strategyDto'
import { ConditionAmount } from '../domain/conditionAmount'
import { ConditionDateMap } from './conditionDateMap'
import { ConditionDate } from '../domain/conditionDate'
import { RewardDiscountMap } from './rewardDiscountMap'
import { RewardDiscount } from '../domain/rewardDiscount'
import { RewardGiveawayMap } from './rewardGiveawayMap'
import { RewardGiveaway } from '../domain/rewardGiveaway'
import { RewardReliefAmountMap } from './rewardReliefAmountMap'
import { RewardReliefAmount } from '../domain/rewardReliefAmount'
import { IStrategyDbModel, IStrategyRewardDbModel, IStrategyConditonDbModel } from '../dbModels/strategyDbModel'
import { IConditionAmountDbModel } from '../dbModels/conditionAmountDbModel'
import { IConditionDateDbModel } from '../dbModels/conditionDateDbModel'
import { IRewardDiscountDbModel } from '../dbModels/rewardDiscountDbModel'
import { IRewardGiveawayDbModel } from '../dbModels/rewardGiveawayDbModel'
import { IRewardReliefAmountDbModel } from '../dbModels/rewardReliefAmountDbModel'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { ConditionCouponMap } from './conditionCouponMap'
import { ConditionCoupon } from '../domain/conditionCoupon'
import { RewardCouponMap } from './rewardCouponMap'
import { RewardCoupon } from '../domain/rewardCoupon'
import { IConditionCouponDbModel } from '../dbModels/conditionCouponDbModel'
import { IRewardCouponDbModel } from '../dbModels/rewardCouponDbModel'
import { ConditionCommodityStrategyTagMap } from './conditionCommodityStrategyTagMap'
import { ConditionCommodityQuantityMap } from './conditionCommodityQuantityMap'
import { ConditionCommodityStrategyTag } from '../domain/conditionCommodityStrategyTag'
import { ConditionCommodityQuantity } from '../domain/conditionCommodityQuantity'
import { IConditionCommodityStrategyTagDbModel } from '../dbModels/conditionCommodityStrategyTagDbModel'
import { IConditionCommodityQuantityDbModel } from '../dbModels/conditionCommodityQuantityDbModel'
import { left, Either, Result, right } from '../../../shared/core/Result'

type StrategyResponse = Either<
  | Result<ConditionAmount>
  | Result<ConditionDate>
  | Result<ConditionCommodityQuantity>
  | Result<ConditionCommodityStrategyTag>
  | Result<ConditionCoupon>
  | Result<RewardCoupon>
  | Result<RewardDiscount>
  | Result<RewardGiveaway>
  | Result<RewardReliefAmount>
  | Result<Strategy>,
  Result<Strategy>
>

export class StrategyMap implements IMapper<Strategy> {
  public static toListDto(strategyList: Strategy[]) {
    let list = []
    for (let item of strategyList) {
      list.push(this.toDTO(item))
    }
    return list
  }

  public static toConditionDto(condition: IStrategyConditon[]) {
    let conditionDtoList = []
    for (let item of condition) {
      if (item.type === 'amount') {
        conditionDtoList.push(ConditionAmountMap.toDTO(item as ConditionAmount))
      } else if (item.type === 'coupon') {
        conditionDtoList.push(ConditionCouponMap.toDTO(item as ConditionCoupon))
      } else if (item.type === 'date') {
        conditionDtoList.push(ConditionDateMap.toDTO(item as ConditionDate))
      } else if (item.type === 'commodityStrategyTag') {
        conditionDtoList.push(ConditionCommodityStrategyTagMap.toDTO(item as ConditionCommodityStrategyTag))
      } else if (item.type === 'commodityQuantity') {
        conditionDtoList.push(ConditionCommodityQuantityMap.toDTO(item as ConditionCommodityQuantity))
      } else {
        console.error(`StrategyMap.condition.toDTO.error: ${item}`)
      }
    }
    return conditionDtoList
  }

  public static toRewardDto(reward: IStrategyReward) {
    let rewardDto = null
    if (reward.type === 'discount') {
      rewardDto = RewardDiscountMap.toDTO(reward as RewardDiscount)
    } else if (reward.type === 'giveaway') {
      rewardDto = RewardGiveawayMap.toDTO(reward as RewardGiveaway)
    } else if (reward.type === 'reliefAmount') {
      rewardDto = RewardReliefAmountMap.toDTO(reward as RewardReliefAmount)
    } else if (reward.type === 'reliefAmount') {
      rewardDto = RewardCouponMap.toDTO(reward as RewardCoupon)
    } else {
      console.error(`StrategyMap.reward.toDTO.error: ${reward}`)
    }
    return rewardDto
  }

  public static toDTO(strategy: Strategy): IStrategyDto {
    let conditionDtoList = this.toConditionDto(strategy.condition)
    let rewardDto = this.toRewardDto(strategy.reward)

    return {
      _id: strategy.id.toString(),
      name: strategy.name,
      condition: conditionDtoList,
      reward: rewardDto,
      description: strategy.description,
    }
  }

  public static toConditionDomain(conditions: IStrategyConditonDbModel[]) {
    let conditionList = []
    for (let item of conditions) {
      if (item.type === 'amount') {
        conditionList.push(ConditionAmountMap.toDomain(item as IConditionAmountDbModel))
      } else if (item.type === 'coupon') {
        conditionList.push(ConditionCouponMap.toDomain(item as IConditionCouponDbModel))
      } else if (item.type === 'date') {
        conditionList.push(ConditionDateMap.toDomain(item as IConditionDateDbModel))
      } else if (item.type === 'commodityStrategyTag') {
        conditionList.push(ConditionCommodityStrategyTagMap.toDomain(item as IConditionCommodityStrategyTagDbModel))
      } else if (item.type === 'commodityQuantity') {
        conditionList.push(ConditionCommodityQuantityMap.toDomain(item as IConditionCommodityQuantityDbModel))
      } else {
        console.error(`StrategyMap.condition.toDTO.error: ${item}`)
      }
    }
    return conditionList
  }

  public static toRewardDomain(rewardDbModel: IStrategyRewardDbModel) {
    let reward = null
    if (rewardDbModel.type === 'discount') {
      reward = RewardDiscountMap.toDomain(rewardDbModel as IRewardDiscountDbModel)
    } else if (rewardDbModel.type === 'giveaway') {
      reward = RewardGiveawayMap.toDomain(rewardDbModel as IRewardGiveawayDbModel)
    } else if (rewardDbModel.type === 'reliefAmount') {
      reward = RewardReliefAmountMap.toDomain(rewardDbModel as IRewardReliefAmountDbModel)
    } else if (rewardDbModel.type === 'coupon') {
      reward = RewardCouponMap.toDomain(rewardDbModel as IRewardCouponDbModel)
    } else {
      console.error(`StrategyMap.reward.toDTO.error: ${rewardDbModel}`)
    }
    return reward
  }

  public static toDomain(raw: IStrategyDbModel): Strategy {
    const conditions = this.toConditionDomain(raw.condition)
    let reward = this.toRewardDomain(raw.reward)

    const strategyOrError = Strategy.create(
      {
        name: raw.name,
        condition: conditions,
        reward: reward,
        description: raw.description,
      },
      new UniqueEntityID(raw._id)
    )

    strategyOrError.isFailure ? console.log(strategyOrError.error) : ''
    return strategyOrError.isSuccess ? strategyOrError.getValue() : null
  }

  public static toConditionPersistence(conditions: IStrategyConditon[]) {
    let conditionList = []
    for (let item of conditions) {
      if (item.type === 'amount') {
        conditionList.push(ConditionAmountMap.toPersistence(item as ConditionAmount))
      } else if (item.type === 'coupon') {
        conditionList.push(ConditionCouponMap.toPersistence(item as ConditionCoupon))
      } else if (item.type === 'date') {
        conditionList.push(ConditionDateMap.toPersistence(item as ConditionDate))
      } else if (item.type === 'commodityStrategyTag') {
        conditionList.push(ConditionCommodityStrategyTagMap.toPersistence(item as ConditionCommodityStrategyTag))
      } else if (item.type === 'commodityQuantity') {
        conditionList.push(ConditionCommodityQuantityMap.toPersistence(item as ConditionCommodityQuantity))
      } else {
        console.error(`StrategyMap.condition.toDTO.error: ${item}`)
      }
    }
    return conditionList
  }

  public static toRewardPersistence(rewardDomain: IStrategyReward) {
    let reward = null
    if (rewardDomain.type === 'discount') {
      reward = RewardDiscountMap.toPersistence(rewardDomain as RewardDiscount)
    } else if (rewardDomain.type === 'giveaway') {
      reward = RewardGiveawayMap.toPersistence(rewardDomain as RewardGiveaway)
    } else if (rewardDomain.type === 'reliefAmount') {
      reward = RewardReliefAmountMap.toPersistence(rewardDomain as RewardReliefAmount)
    } else if (rewardDomain.type === 'reliefAmount') {
      reward = RewardCouponMap.toPersistence(rewardDomain as RewardCoupon)
    } else {
      console.error(`StrategyMap.reward.toDTO.error: ${rewardDomain}`)
    }
    return reward
  }

  public static toPersistence(strategy: Strategy): IStrategyDbModel {
    let conditionList = this.toConditionPersistence(strategy.condition)
    let reward = this.toRewardPersistence(strategy.reward)
    return {
      _id: strategy.id.toString(),
      name: strategy.name,
      condition: conditionList,
      reward: reward,
      description: strategy.description,
    }
  }

  public static dtoToDomain(strategyDto: IStrategyDto): StrategyResponse {
    const { name, condition, description, reward } = strategyDto

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

    const strategyOrError = Strategy.create({
      name: name,
      condition: conditionList,
      reward: strategyReward,
      description: description,
    })

    if (strategyOrError.isFailure) {
      return left(strategyOrError)
    }

    return right(Result.ok<Strategy>(strategyOrError.getValue()))
  }
}
