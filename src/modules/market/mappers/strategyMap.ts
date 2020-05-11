import { ConditionAmountMap } from "./conditionAmountMap"
import { IMapper } from "../../../shared/infra/Mapper"
import { Strategy } from "../domain/strategy"
import { StrategyDto } from "../dtos/strategyDto"
import { ConditionAmount } from "../domain/conditionAmount"
import { ConditionDateMap } from "./conditionDateMap"
import { ConditionDate } from "../domain/conditionDate"
import { RewardDiscountMap } from "./rewardDiscountMap"
import { RewardDiscount } from "../domain/rewardDiscount"
import { RewardGiveawayMap } from "./rewardGiveawayMap"
import { RewardGiveaway } from "../domain/rewardGiveaway"
import { RewardReliefAmountMap } from "./rewardReliefAmountMap"
import { RewardReliefAmount } from "../domain/rewardReliefAmount"
import { IStrategyDbModel } from "../dbModels/strategyDbModel"
import { IConditionAmountDbModel } from "../dbModels/conditionAmountDbModel"
import { IConditionDateDbModel } from "../dbModels/conditionDateDbModel"
import { IRewardDiscountDbModel } from "../dbModels/rewardDiscountDbModel"
import { IRewardGiveawayDbModel } from "../dbModels/rewardGiveawayDbModel"
import { IRewardReliefAmountDbModel } from "../dbModels/rewardReliefAmountDbModel"
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID"
import { ConditionCouponMap } from "./conditionCouponMap"
import { ConditionCoupon } from "../domain/conditionCoupon"
import { RewardCouponMap } from "./rewardCouponMap"
import { RewardCoupon } from "../domain/rewardCoupon"
import { IConditionCouponDbModel } from "../dbModels/conditionCouponDbModel"
import { IRewardCouponDbModel } from "../dbModels/rewardCouponDbModel"

export class StrategyMap implements IMapper<Strategy> {
  public static toDTO(strategy: Strategy): StrategyDto {
    let conditionDtoList = []
    for (let item of strategy.condition) {
      if (Reflect.has(item, 'amount')) {
        conditionDtoList.push(ConditionAmountMap.toDTO(item as ConditionAmount))
      } else if (Reflect.has(item, 'coupon')) {
        conditionDtoList.push(ConditionCouponMap.toDTO(item as ConditionCoupon))
      } else if (Reflect.has(item, 'date')) {
        conditionDtoList.push(ConditionDateMap.toDTO(item as ConditionDate))
      } else {
        console.error(`StrategyMap.condition.toDTO.error: ${item}`)
      }
    }

    let rewardDto = null
    if (Reflect.has(strategy.reward, 'discount')) {
      rewardDto = RewardDiscountMap.toDTO(strategy.reward as RewardDiscount)
    } else if (Reflect.has(strategy.reward, 'giveaway')) {
      rewardDto = RewardGiveawayMap.toDTO(strategy.reward as RewardGiveaway)
    } else if (Reflect.has(strategy.reward, 'reliefAmount')) {
      rewardDto = RewardReliefAmountMap.toDTO(strategy.reward as RewardReliefAmount)
    } else if (Reflect.has(strategy.reward, 'reliefAmount')) {
      rewardDto = RewardCouponMap.toDTO(strategy.reward as RewardCoupon)
    } else {
      console.error(`StrategyMap.reward.toDTO.error: ${strategy.reward}`)
    }

    return {
      name: strategy.name,
      condition: conditionDtoList,
      reward: rewardDto,
      description: strategy.description
    }
  }

  public static toDomain(raw: IStrategyDbModel): Strategy {

    let conditionList = []
    for (let item of raw.condition) {
      if (Reflect.has(item, 'amount')) {
        conditionList.push(ConditionAmountMap.toDomain(item as IConditionAmountDbModel))
      } else if (Reflect.has(item, 'coupon')) {
        conditionList.push(ConditionCouponMap.toDomain(item as IConditionCouponDbModel))
      } else if (Reflect.has(item, 'date')) {
        conditionList.push(ConditionDateMap.toDomain(item as IConditionDateDbModel))
      } else {
        console.error(`StrategyMap.condition.toDTO.error: ${item}`)
      }
    }

    let reward = null
    if (Reflect.has(raw.reward, 'discount')) {
      reward = RewardDiscountMap.toDomain(raw.reward as IRewardDiscountDbModel)
    } else if (Reflect.has(raw.reward, 'giveaway')) {
      reward = RewardGiveawayMap.toDomain(raw.reward as IRewardGiveawayDbModel)
    } else if (Reflect.has(raw.reward, 'reliefAmount')) {
      reward = RewardReliefAmountMap.toDomain(raw.reward as IRewardReliefAmountDbModel)
    } else if (Reflect.has(raw.reward, 'reliefAmount')) {
      reward = RewardCouponMap.toDomain(raw.reward as IRewardCouponDbModel)
    } else {
      console.error(`StrategyMap.reward.toDTO.error: ${raw.reward}`)
    }

    const strategyOrError = Strategy.create(
      {
        name: raw.name,
        condition: conditionList,
        reward: reward,
        description: raw.description,
      },
      new UniqueEntityID(raw._id)
    )

    strategyOrError.isFailure ? console.log(strategyOrError.error) : ''
    return strategyOrError.isSuccess ? strategyOrError.getValue() : null
  }

  public static toPersistence(strategy: Strategy): IStrategyDbModel {

    let conditionList = []
    for (let item of strategy.condition) {
      if (Reflect.has(item, 'amount')) {
        conditionList.push(ConditionAmountMap.toPersistence(item as ConditionAmount))
      } else if (Reflect.has(item, 'coupon')) {
        conditionList.push(ConditionCouponMap.toPersistence(item as ConditionCoupon))
      } else if (Reflect.has(item, 'date')) {
        conditionList.push(ConditionDateMap.toPersistence(item as ConditionDate))
      } else {
        console.error(`StrategyMap.condition.toDTO.error: ${item}`)
      }
    }

    let reward = null
    if (Reflect.has(strategy.reward, 'discount')) {
      reward = RewardDiscountMap.toPersistence(strategy.reward as RewardDiscount)
    } else if (Reflect.has(strategy.reward, 'giveaway')) {
      reward = RewardGiveawayMap.toPersistence(strategy.reward as RewardGiveaway)
    } else if (Reflect.has(strategy.reward, 'reliefAmount')) {
      reward = RewardReliefAmountMap.toPersistence(strategy.reward as RewardReliefAmount)
    } else if (Reflect.has(strategy.reward, 'reliefAmount')) {
      reward = RewardCouponMap.toPersistence(strategy.reward as RewardCoupon)
    } else {
      console.error(`StrategyMap.reward.toDTO.error: ${strategy.reward}`)
    }

    return {
      _id: strategy.id.toString(),
      name: strategy.name,
      condition: conditionList,
      reward: reward,
      description: strategy.description
    }
  }
}
