import { ValueObject } from '../../../shared/domain/ValueObject'
import { Result } from '../../../shared/core/Result'
import { IGuardArgument, Guard } from '../../../shared/core/Guard'

export interface IConditionDateProps {
  type: 'date'
  beginAt: number
  finishAt: number
}

export class ConditionDate extends ValueObject<IConditionDateProps> {
  private constructor(props: IConditionDateProps) {
    super(props)
  }

  get type(): string {
    return this.props.type
  }

  get beginAt(): number {
    return this.props.beginAt
  }


  get finishAt(): number {
    return this.props.finishAt
  }


  public static create(props: IConditionDateProps): Result<ConditionDate> {
    const guardArgs: IGuardArgument[] = [
      { argument: props.beginAt, argumentName: 'beginAt' },
      { argument: props.finishAt, argumentName: 'cfinishAtouponId' },
    ]

    const guardResult = Guard.againstNullOrUndefinedBulk(guardArgs)

    if (!guardResult.succeeded) {
      return Result.fail<ConditionDate>(guardResult.message)
    }

    const model = new ConditionDate({
      ...props,
    })

    return Result.ok<ConditionDate>(model)
  }
}
