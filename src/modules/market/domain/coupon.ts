import { AggregateRoot } from '../../../shared/domain/AggregateRoot'
import { ConditionDate } from './conditionDate'
import { ConditionAmount } from './conditionAmount'
import { RewardReliefAmount } from './rewardReliefAmount'
import { RewardDiscount } from './rewardDiscount'
import { RewardGiveaway } from './rewardGiveaway'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { Result } from '../../../shared/core/Result'
import { IGuardArgument, Guard } from '../../../shared/core/Guard'

export interface ICouponProps {
  name: string
  condition: ICouponConditon[]
  reward: ICouponReward
}

export type ICouponConditon = ConditionDate | ConditionAmount

export type ICouponReward = RewardDiscount | RewardGiveaway | RewardReliefAmount

export class Coupon extends AggregateRoot<ICouponProps> {
  private constructor(props: ICouponProps, id?: UniqueEntityID) {
    super(props, id)
  }

  get name(): string {
    return this.props.name
  }

  get condition(): ICouponConditon[] {
    return this.props.condition
  }

  get reward(): RewardDiscount | RewardGiveaway | RewardReliefAmount {
    return this.props.reward
  }

  public static create(props: ICouponProps, id?: UniqueEntityID): Result<Coupon> {
    const guardArgs: IGuardArgument[] = [
      { argument: props.name, argumentName: '名称' },
      { argument: props.condition, argumentName: '描述' },
    ]

    const guardResult = Guard.againstNullOrUndefinedBulk(guardArgs)

    if (!guardResult.succeeded) {
      return Result.fail<Coupon>(guardResult.message)
    }

    const defaultValues: ICouponProps = {
      ...props,
    }

    const commodityTag = new Coupon(defaultValues, id)

    const isNew = !!id === false
    if (isNew) {
    }
    return Result.ok<Coupon>(commodityTag)
  }
}
