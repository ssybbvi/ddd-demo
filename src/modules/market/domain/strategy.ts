import { ConditionDate } from './conditionDate'
import { ConditionAmount } from './conditionAmount'

import { Entity } from '../../../shared/domain/Entity'
import { RewardDiscount } from './rewardDiscount'
import { RewardGiveaway } from './rewardGiveaway'
import { RewardReliefAmount } from './rewardReliefAmount'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { Result } from '../../../shared/core/Result'
import { IGuardArgument, Guard } from '../../../shared/core/Guard'
import { RewardCoupon } from './rewardCoupon'
import { ConditionCoupon } from './conditionCoupon'
import { AggregateRoot } from '../../../shared/domain/AggregateRoot'

export interface IStrategyProps {
  name: string
  description: string
  condition: IStrategyConditon[]
  reward: IStrategyReward
}

export type IStrategyConditon = ConditionDate | ConditionCoupon | ConditionAmount
export type IStrategyReward = RewardCoupon | RewardDiscount | RewardGiveaway | RewardReliefAmount

export class Strategy extends AggregateRoot<IStrategyProps> {
  private constructor(props: IStrategyProps, id?: UniqueEntityID) {
    super(props, id)
  }

  get name(): string {
    return this.props.name
  }

  get condition(): IStrategyConditon[] {
    return this.props.condition
  }

  get reward(): RewardCoupon | RewardDiscount | RewardGiveaway | RewardReliefAmount {
    return this.props.reward
  }

  get description(): string {
    return this.props.description
  }


  public static create(props: IStrategyProps, id?: UniqueEntityID): Result<Strategy> {
    const guardArgs: IGuardArgument[] = [
      { argument: props.name, argumentName: '名称' },
      { argument: props.condition, argumentName: '描述' },
    ]

    const guardResult = Guard.againstNullOrUndefinedBulk(guardArgs)

    if (!guardResult.succeeded) {
      return Result.fail<Strategy>(guardResult.message)
    }

    const defaultValues: IStrategyProps = {
      ...props,
    }

    const model = new Strategy(defaultValues, id)

    const isNew = !!id === false
    if (isNew) {
    }
    return Result.ok<Strategy>(model)
  }
}
