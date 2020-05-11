import { IMapper } from '../../../shared/infra/Mapper'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { Coupon, ICouponConditon, ICouponReward } from '../domain/coupon'
import { CouponDto } from '../dtos/couponDto'
import { ConditionAmountMap } from './conditionAmountMap'
import { ConditionAmount } from '../domain/conditionAmount'
import { ConditionDateMap } from './conditionDateMap'
import { ConditionDate } from '../domain/conditionDate'
import { RewardDiscount } from '../domain/rewardDiscount'
import { RewardDiscountMap } from './rewardDiscountMap'
import { RewardGiveaway } from '../domain/rewardGiveaway'
import { RewardGiveawayMap } from './rewardGiveawayMap'
import { RewardReliefAmount } from '../domain/rewardReliefAmount'
import { RewardReliefAmountMap } from './rewardReliefAmountMap'
import { ICouponDbModel, ICouponConditonDbModel, ICouponRewardDbModel } from '../dbModels/couponDbModel'
import { IConditionAmountDbModel } from '../dbModels/conditionAmountDbModel'
import { IConditionDateDbModel } from '../dbModels/conditionDateDbModel'
import { IRewardDiscountDbModel } from '../dbModels/rewardDiscountDbModel'
import { IRewardGiveawayDbModel } from '../dbModels/rewardGiveawayDbModel'
import { IRewardReliefAmountDbModel } from '../dbModels/rewardReliefAmountDbModel'

export class CouponMap implements IMapper<Coupon> {
  public static toConditionDTO(couponConditon: ICouponConditon[]) {
    let conditionDtoList = []
    for (let item of couponConditon) {
      if (Reflect.has(item, 'amount')) {
        conditionDtoList.push(ConditionAmountMap.toDTO(item as ConditionAmount))
      } else if (Reflect.has(item, 'date')) {
        conditionDtoList.push(ConditionDateMap.toDTO(item as ConditionDate))
      } else {
        console.error(`CouponMap.condition.toDTO.error: ${item}`)
      }
    }
    return conditionDtoList
  }

  public static toRewardDto(reward: ICouponReward) {
    let rewardDto = null
    if (Reflect.has(reward, 'discount')) {
      rewardDto = RewardDiscountMap.toDTO(reward as RewardDiscount)
    } else if (Reflect.has(reward, 'giveaway')) {
      rewardDto = RewardGiveawayMap.toDTO(reward as RewardGiveaway)
    } else if (Reflect.has(reward, 'reliefAmount')) {
      rewardDto = RewardReliefAmountMap.toDTO(reward as RewardReliefAmount)
    } else {
      console.error(`CouponMap.reward.toDTO.error: ${reward}`)
    }
    return rewardDto
  }


  public static toDTO(coupon: Coupon): CouponDto {
    let conditionDtoList = this.toConditionDTO(coupon.condition)
    let rewardDto = this.toRewardDto(coupon.reward)

    return {
      name: coupon.name,
      condition: conditionDtoList,
      reward: rewardDto
    }
  }



  public static toConditionDomain(condition: ICouponConditonDbModel[]) {
    let conditionList = []
    for (let item of condition) {
      if (Reflect.has(item, 'amount')) {
        conditionList.push(ConditionAmountMap.toDomain(item as IConditionAmountDbModel))
      } else if (Reflect.has(item, 'date')) {
        conditionList.push(ConditionDateMap.toDomain(item as IConditionDateDbModel))
      } else {
        console.error(`CouponMap.condition.toDTO.error: ${item}`)
      }
    }
    return conditionList
  }

  public static toRewardDomain(raw: ICouponRewardDbModel) {
    let reward = null
    if (Reflect.has(raw, 'discount')) {
      reward = RewardDiscountMap.toDomain(raw as IRewardDiscountDbModel)
    } else if (Reflect.has(raw, 'giveaway')) {
      reward = RewardGiveawayMap.toDomain(raw as IRewardGiveawayDbModel)
    } else if (Reflect.has(raw, 'reliefAmount')) {
      reward = RewardReliefAmountMap.toDomain(raw as IRewardReliefAmountDbModel)
    } else {
      console.error(`CouponMap.reward.toDTO.error: ${raw}`)
    }
    return reward
  }

  public static toDomain(raw: ICouponDbModel): Coupon {
    let conditionList = this.toConditionDomain(raw.condition)
    let reward = this.toRewardDomain(raw.reward)

    const couponOrError = Coupon.create(
      {
        name: raw.name,
        condition: conditionList,
        reward: reward
      },
      new UniqueEntityID(raw._id)
    )

    couponOrError.isFailure ? console.log(couponOrError.error) : ''
    return couponOrError.isSuccess ? couponOrError.getValue() : null
  }



  public static toConditionPersistence(conditions: ICouponConditon[]) {
    let conditionDbModelList = []
    for (let item of conditions) {
      if (Reflect.has(item, 'amount')) {
        conditionDbModelList.push(ConditionAmountMap.toPersistence(item as ConditionAmount))
      } else if (Reflect.has(item, 'date')) {
        conditionDbModelList.push(ConditionDateMap.toPersistence(item as ConditionDate))
      } else {
        console.error(`CouponMap.condition.toDTO.error: ${item}`)
      }
    }
    return conditionDbModelList
  }

  public static toRewardPersistence(reward: ICouponReward) {
    let rewardDbModel = null
    if (Reflect.has(reward, 'discount')) {
      rewardDbModel = RewardDiscountMap.toPersistence(reward as RewardDiscount)
    } else if (Reflect.has(reward, 'giveaway')) {
      rewardDbModel = RewardGiveawayMap.toPersistence(reward as RewardGiveaway)
    } else if (Reflect.has(reward, 'reliefAmount')) {
      rewardDbModel = RewardReliefAmountMap.toPersistence(reward as RewardReliefAmount)
    } else {
      console.error(`CouponMap.reward.toDTO.error: ${reward}`)
    }
    return rewardDbModel
  }


  public static toPersistence(coupon: Coupon): ICouponDbModel {
    const conditionDbModelList = this.toConditionPersistence(coupon.condition)
    const rewardDbModel = this.toRewardPersistence(coupon.reward)

    return {
      _id: coupon.id.toString(),
      name: coupon.name,
      condition: conditionDbModelList,
      reward: rewardDbModel
    }
  }
}
