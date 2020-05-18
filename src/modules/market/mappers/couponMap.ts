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
      if (item.type === 'amount') {
        conditionDtoList.push(ConditionAmountMap.toDTO(item as ConditionAmount))
      } else if (item.type === 'date') {
        conditionDtoList.push(ConditionDateMap.toDTO(item as ConditionDate))
      } else {
        console.error(`CouponMap.condition.toDTO.error: ${item}`)
      }
    }
    return conditionDtoList
  }

  public static toRewardDto(reward: ICouponReward) {
    let rewardDto = null
    if (reward.type === 'discount') {
      rewardDto = RewardDiscountMap.toDTO(reward as RewardDiscount)
    } else if (reward.type === 'giveaway') {
      rewardDto = RewardGiveawayMap.toDTO(reward as RewardGiveaway)
    } else if (reward.type === 'reliefAmount') {
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
      reward: rewardDto,
      receiveLimit: coupon.receiveLimit,
      userReceiveLimit: coupon.userReceiveLimit,
    }
  }

  public static toConditionDomain(condition: ICouponConditonDbModel[]) {
    let conditionList = []
    for (let item of condition) {
      if (item.type === 'amount') {
        conditionList.push(ConditionAmountMap.toDomain(item as IConditionAmountDbModel))
      } else if (item.type === 'date') {
        conditionList.push(ConditionDateMap.toDomain(item as IConditionDateDbModel))
      } else {
        console.error(`CouponMap.condition.toDTO.error: ${item}`)
      }
    }
    return conditionList
  }

  public static toRewardDomain(raw: ICouponRewardDbModel) {
    let reward = null
    if (raw.type === 'discount') {
      reward = RewardDiscountMap.toDomain(raw as IRewardDiscountDbModel)
    } else if (raw.type === 'giveaway') {
      reward = RewardGiveawayMap.toDomain(raw as IRewardGiveawayDbModel)
    } else if (raw.type === 'reliefAmount') {
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
        reward: reward,
        receiveLimit: raw.receiveLimit,
        userReceiveLimit: raw.userReceiveLimit,
      },
      new UniqueEntityID(raw._id)
    )

    couponOrError.isFailure ? console.log(couponOrError.error) : ''
    return couponOrError.isSuccess ? couponOrError.getValue() : null
  }

  public static toConditionPersistence(conditions: ICouponConditon[]) {
    let conditionDbModelList = []
    for (let item of conditions) {
      if (item.type === 'amount') {
        conditionDbModelList.push(ConditionAmountMap.toPersistence(item as ConditionAmount))
      } else if (item.type === 'date') {
        conditionDbModelList.push(ConditionDateMap.toPersistence(item as ConditionDate))
      } else {
        console.error(`CouponMap.condition.toDTO.error: ${item}`)
      }
    }
    return conditionDbModelList
  }

  public static toRewardPersistence(reward: ICouponReward) {
    let rewardDbModel = null
    if (reward.type === 'discount') {
      rewardDbModel = RewardDiscountMap.toPersistence(reward as RewardDiscount)
    } else if (reward.type === 'giveaway') {
      rewardDbModel = RewardGiveawayMap.toPersistence(reward as RewardGiveaway)
    } else if (reward.type === 'reliefAmount') {
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
      reward: rewardDbModel,
      receiveLimit: coupon.receiveLimit,
      userReceiveLimit: coupon.userReceiveLimit,
    }
  }
}
