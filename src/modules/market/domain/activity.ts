import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { Result } from '../../../shared/core/Result'
import { IGuardArgument, Guard } from '../../../shared/core/Guard'
import { AggregateRoot } from '../../../shared/domain/AggregateRoot'
import { Strategy } from './strategy'

export interface IActivityProps {
  isEnable: boolean
  strategy: Strategy
}

export class Activity extends AggregateRoot<IActivityProps> {
  private constructor(props: IActivityProps, id?: UniqueEntityID) {
    super(props, id)
  }

  get isEnable(): boolean {
    return this.props.isEnable
  }

  get strategy(): Strategy {
    return this.props.strategy
  }

  public updateIsEnable(isEnable: boolean) {
    this.props.isEnable = isEnable
  }

  public static create(props: IActivityProps, id?: UniqueEntityID): Result<Activity> {
    const guardArgs: IGuardArgument[] = [
      { argument: props.isEnable, argumentName: '是否启用' },
      { argument: props.strategy, argumentName: '策略' },
    ]

    const guardResult = Guard.againstNullOrUndefinedBulk(guardArgs)

    if (!guardResult.succeeded) {
      return Result.fail<Activity>(guardResult.message)
    }

    const defaultValues: IActivityProps = {
      ...props,
    }

    const model = new Activity(defaultValues, id)

    const isNew = !!id === false
    if (isNew) {
    }
    return Result.ok<Activity>(model)
  }
}
