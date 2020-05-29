import { ValueObject } from '../../../shared/domain/ValueObject'
import { IGuardArgument, Guard } from '../../../shared/core/Guard'
import { Result } from '../../../shared/core/Result'
import { StrategyCommodity } from './strategyCommodity'

export interface IConditionAmountProps {
  type: 'amount'
  amount: number
}

export class ConditionAmount extends ValueObject<IConditionAmountProps> {
  private constructor(props: IConditionAmountProps) {
    super(props)
  }

  get type(): string {
    return this.props.type
  }

  get amount(): number {
    return this.props.amount
  }

  public IsAvailable(strategyCommoditys: StrategyCommodity[]): boolean {
    return this.props.amount <= strategyCommoditys.reduce((acc, item) => (acc += item.amount), 0)
  }

  public static create(props: IConditionAmountProps): Result<ConditionAmount> {
    const guardArgs: IGuardArgument[] = [{ argument: props.amount, argumentName: '金额' }]

    const guardResult = Guard.againstNullOrUndefinedBulk(guardArgs)

    if (!guardResult.succeeded) {
      return Result.fail<ConditionAmount>(guardResult.message)
    }

    const model = new ConditionAmount({
      ...props,
    })

    return Result.ok<ConditionAmount>(model)
  }
}
