import { AggregateRoot } from '../../../shared/domain/AggregateRoot'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { Result, Either, left, right } from '../../../shared/core/Result'
import { IGuardArgument, Guard } from '../../../shared/core/Guard'
import { UseCaseError } from '../../../shared/core/UseCaseError'

export class ExceededUserReceiveLimitError extends Result<UseCaseError> {
  constructor() {
    super(false, {
      message: `超过活动券每人领取次数`,
    } as UseCaseError)
  }
}

export class ExceededPublishTotalError extends Result<UseCaseError> {
  constructor() {
    super(false, {
      message: `超过活动券发布总张数`,
    } as UseCaseError)
  }
}

export interface ICouponProps {
  name: string
  userReceiveLimit?: number
  publishTotal: number
  receiveTotal?: number
  useTotal?: number
}

export class Coupon extends AggregateRoot<ICouponProps> {
  private constructor(props: ICouponProps, id?: UniqueEntityID) {
    super(props, id)
  }

  get name(): string {
    return this.props.name
  }

  get receiveTotal(): number {
    return this.props.receiveTotal
  }

  get userReceiveLimit(): number {
    return this.props.userReceiveLimit
  }

  get publishTotal(): number {
    return this.props.publishTotal
  }

  get useTotal(): number {
    return this.props.useTotal
  }

  public receive(
    userReceiveTotal: number
  ): Either<ExceededUserReceiveLimitError | ExceededPublishTotalError, Result<void>> {
    if (this.props.receiveTotal >= this.props.publishTotal) {
      return left(new ExceededPublishTotalError())
    }

    if (userReceiveTotal + 1 > this.props.userReceiveLimit) {
      return left(new ExceededUserReceiveLimitError())
    }
    this.props.receiveTotal++
    return right(Result.ok<void>())
  }

  public increaseUseTotal() {
    this.props.useTotal++
  }

  public static create(props: ICouponProps, id?: UniqueEntityID): Result<Coupon> {
    const guardArgs: IGuardArgument[] = [
      { argument: props.name, argumentName: '名称' },
      { argument: props.publishTotal, argumentName: '发布总数' },
    ]

    const guardResult = Guard.againstNullOrUndefinedBulk(guardArgs)

    if (!guardResult.succeeded) {
      return Result.fail<Coupon>(guardResult.message)
    }

    const defaultValues: ICouponProps = {
      ...props,
      receiveTotal: props.receiveTotal ? props.receiveTotal : 0,
      userReceiveLimit: props.userReceiveLimit ? props.userReceiveLimit : 1,
    }

    const commodityTag = new Coupon(defaultValues, id)

    const isNew = !!id === false
    if (isNew) {
    }
    return Result.ok<Coupon>(commodityTag)
  }
}
