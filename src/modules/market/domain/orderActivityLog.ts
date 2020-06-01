import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { Result } from '../../../shared/core/Result'
import { IGuardArgument, Guard } from '../../../shared/core/Guard'
import { AggregateRoot } from '../../../shared/domain/AggregateRoot'

import { Strategys } from './strategys'

export interface IOrderActivityLogProps {
  orderId: string
  strategys: Strategys
}

export class OrderActivityLog extends AggregateRoot<IOrderActivityLogProps> {
  private constructor(props: IOrderActivityLogProps, id?: UniqueEntityID) {
    super(props, id)
  }

  get orderId(): string {
    return this.props.orderId
  }

  get strategys(): Strategys {
    return this.props.strategys
  }

  public static create(props: IOrderActivityLogProps, id?: UniqueEntityID): Result<OrderActivityLog> {
    const guardArgs: IGuardArgument[] = [
      { argument: props.orderId, argumentName: 'orderId' },
      { argument: props.strategys, argumentName: 'strategys' },
    ]

    const guardResult = Guard.againstNullOrUndefinedBulk(guardArgs)

    if (!guardResult.succeeded) {
      return Result.fail<OrderActivityLog>(guardResult.message)
    }

    const defaultValues: IOrderActivityLogProps = {
      ...props,
    }

    const model = new OrderActivityLog(defaultValues, id)

    const isNew = !!id === false
    if (isNew) {
    }
    return Result.ok<OrderActivityLog>(model)
  }
}
