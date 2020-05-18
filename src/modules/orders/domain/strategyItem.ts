import { Entity } from '../../../shared/domain/Entity'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { Result } from '../../../shared/core/Result'
import { Guard } from '../../../shared/core/Guard'
import { IStrategyConditon, IStrategyReward } from '../../market/domain/strategy'

export interface StrategyItemProps {
  strategyId: string
  name: string
  description: string
  condition: IStrategyConditon[]
  reward: IStrategyReward
}

export class StrategyItem extends Entity<StrategyItemProps> {
  get id(): UniqueEntityID {
    return this._id
  }

  get name(): string {
    return this.props.name
  }

  get description(): string {
    return this.props.description
  }

  get condition(): IStrategyConditon[] {
    return this.props.condition
  }

  get reward(): IStrategyReward {
    return this.props.reward
  }

  private constructor(props: StrategyItemProps, id?: UniqueEntityID) {
    super(props, id)
  }

  public static create(props: StrategyItemProps, id?: UniqueEntityID): Result<StrategyItem> {
    const nullGuard = Guard.againstNullOrUndefinedBulk([
      { argument: props.strategyId, argumentName: '商品名称' },
      { argument: props.name, argumentName: '商品名称' },
      { argument: props.description, argumentName: '描述' },
      { argument: props.condition, argumentName: '条件' },
      { argument: props.reward, argumentName: '奖励' },
    ])

    if (!nullGuard.succeeded) {
      return Result.fail<StrategyItem>(nullGuard.message)
    }

    const defaultProps: StrategyItemProps = {
      ...props,
    }

    const strategyItem = new StrategyItem(defaultProps, id)

    return Result.ok<StrategyItem>(strategyItem)
  }
}
