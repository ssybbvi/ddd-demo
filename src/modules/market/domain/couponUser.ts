import { AggregateRoot } from '../../../shared/domain/AggregateRoot'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { Result } from '../../../shared/core/Result'
import { IGuardArgument, Guard } from '../../../shared/core/Guard'

export interface ICouponUserProps {
  couponId: string
  userId: string
  isUse?: boolean
  useAt?: number
}

export class CouponUser extends AggregateRoot<ICouponUserProps> {
  private constructor(props: ICouponUserProps, id?: UniqueEntityID) {
    super(props, id)
  }

  get couponId(): string {
    return this.props.couponId
  }

  get userId(): string {
    return this.props.userId
  }

  get isUse(): boolean {
    return this.props.isUse
  }

  get useAt(): number {
    return this.props.useAt
  }

  public use() {
    this.props.useAt = Date.now()
    this.props.isUse = true
  }

  public static create(props: ICouponUserProps, id?: UniqueEntityID): Result<CouponUser> {
    const guardArgs: IGuardArgument[] = [
      { argument: props.couponId, argumentName: 'couponId' },
      { argument: props.userId, argumentName: 'userId' },
    ]

    const guardResult = Guard.againstNullOrUndefinedBulk(guardArgs)

    if (!guardResult.succeeded) {
      return Result.fail<CouponUser>(guardResult.message)
    }

    const defaultValues: ICouponUserProps = {
      ...props,
      isUse: props.isUse ? props.isUse : false,
    }

    const model = new CouponUser(defaultValues, id)

    const isNew = !!id === false
    if (isNew) {
    }
    return Result.ok<CouponUser>(model)
  }
}
