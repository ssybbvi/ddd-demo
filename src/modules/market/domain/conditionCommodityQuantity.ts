import { ValueObject } from '../../../shared/domain/ValueObject'
import { IGuardArgument, Guard } from '../../../shared/core/Guard'
import { Result } from '../../../shared/core/Result'
import { StrategyCommodity } from './strategyCommodity'

export interface IConditionCommodityQuantityProps {
  type: 'commodityQuantity'
  quantity: number
}

export class ConditionCommodityQuantity extends ValueObject<IConditionCommodityQuantityProps> {
  private constructor(props: IConditionCommodityQuantityProps) {
    super(props)
  }

  get type(): string {
    return this.props.type
  }

  get quantity(): number {
    return this.props.quantity
  }

  public IsAvailable(strategyCommoditys: StrategyCommodity[]): boolean {
    return strategyCommoditys.length >= this.props.quantity
  }

  public static create(props: IConditionCommodityQuantityProps): Result<ConditionCommodityQuantity> {
    const guardArgs: IGuardArgument[] = [{ argument: props.quantity, argumentName: '数量' }]

    const guardResult = Guard.againstNullOrUndefinedBulk(guardArgs)

    if (!guardResult.succeeded) {
      return Result.fail<ConditionCommodityQuantity>(guardResult.message)
    }

    const model = new ConditionCommodityQuantity({
      ...props,
    })

    return Result.ok<ConditionCommodityQuantity>(model)
  }
}
