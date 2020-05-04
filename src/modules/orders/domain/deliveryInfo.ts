import { AddressInfo } from './addressInfo'
import { Result, left, right, Either } from '../../../shared/core/Result'
import { Guard } from '../../../shared/core/Guard'
import { UseCaseError } from '../../../shared/core/UseCaseError'
import { ValueObject } from '../../../shared/domain/ValueObject'

export class RepeatShipmentError extends Result<UseCaseError> {
  constructor() {
    super(false, {
      message: `无法重复发货`,
    } as UseCaseError)
  }
}

export class NotShippingError extends Result<UseCaseError> {
  constructor() {
    super(false, {
      message: `还没有发货`,
    } as UseCaseError)
  }
}

export class ExpectNotReceivedError extends Result<UseCaseError> {
  constructor() {
    super(false, {
      message: `无法重复收货`,
    } as UseCaseError)
  }
}

export interface IDeliveryInfoProps {
  beginAt?: number
  code?: string
  finishAt?: number
  type?: string
}

export class DeliveryInfo extends ValueObject<IDeliveryInfoProps> {
  get beginAt(): number {
    return this.props.beginAt
  }

  get code(): string {
    return this.props.code
  }

  get finishAt(): number {
    return this.props.finishAt
  }

  get type(): string {
    return this.props.type
  }

  public shipped(code: string, type: string): Either<RepeatShipmentError | Result<any>, Result<void>> {
    const nullGuard = Guard.againstNullOrUndefinedBulk([
      { argument: code, argumentName: '运单号' },
      { argument: type, argumentName: '配送方式' },
    ])

    if (!nullGuard.succeeded) {
      return left(Result.fail<void>(nullGuard.message))
    }

    if (this.props.beginAt) {
      return left(new RepeatShipmentError())
    }
    this.props.beginAt = Date.now()
    this.props.code = code
    this.props.type = type
    return right(Result.ok<void>())
  }

  public received(): Either<NotShippingError | ExpectNotReceivedError, Result<void>> {
    if (!this.props.beginAt) {
      return left(new NotShippingError())
    }

    if (this.props.finishAt) {
      return left(new ExpectNotReceivedError())
    }

    this.props.finishAt = Date.now()
    return right(Result.ok<void>())
  }

  public static create(props: IDeliveryInfoProps): Result<DeliveryInfo> {
    const defaultProps: IDeliveryInfoProps = {
      ...props,
    }

    const model = new DeliveryInfo(defaultProps)
    return Result.ok<DeliveryInfo>(model)
  }
}
