import { ConditionAmountMap } from './conditionAmountMap'
import { IMapper } from '../../../shared/infra/Mapper'
import { Strategy, IStrategyConditon, IStrategyReward } from '../domain/strategy'
import { StrategyDto } from '../dtos/strategyDto'
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

export class StrategyMap implements IMapper<Strategy> {
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

  public static toDTO(strategy: Strategy): StrategyDto {
    let conditionDtoList = this.toConditionDto(strategy.condition)
    let rewardDto = this.toRewardDto(strategy.reward)

    return {
      name: strategy.name,
      condition: conditionDtoList,
      reward: rewardDto,
      description: strategy.description,
    }
  }

  public static toConditionDomain(conditions: IStrategyConditonDbModel[]) {
    let conditionList = []
    for (let item of conditions) {
      if (Reflect.has(item, 'amount')) {
        conditionList.push(ConditionAmountMap.toDomain(item as IConditionAmountDbModel))
      } else if (Reflect.has(item, 'coupon')) {
        conditionList.push(ConditionCouponMap.toDomain(item as IConditionCouponDbModel))
      } else if (Reflect.has(item, 'date')) {
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
}
