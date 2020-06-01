import { ValueObject } from '../../../shared/domain/ValueObject'
import { IGuardArgument, Guard } from '../../../shared/core/Guard'
import { Result } from '../../../shared/core/Result'
import { CommodityItem } from '../../orders/domain/commodityItem'

export interface IConditionCommodityStrategyTagProps {
  type: 'commodityStrategyTag'
  tag: string
}

export class ConditionCommodityStrategyTag extends ValueObject<IConditionCommodityStrategyTagProps> {
  private constructor(props: IConditionCommodityStrategyTagProps) {
    super(props)
  }

  get type(): string {
    return this.props.type
  }

  get tag(): string {
    return this.props.tag
  }

  public IsAvailable(strategyCommoditys: CommodityItem[]): boolean {
    return strategyCommoditys.every((item) => item.strategyTags.includes(this.props.tag))
  }

  public static create(props: IConditionCommodityStrategyTagProps): Result<ConditionCommodityStrategyTag> {
    const guardArgs: IGuardArgument[] = [{ argument: props.tag, argumentName: '商品策略标签' }]

    const guardResult = Guard.againstNullOrUndefinedBulk(guardArgs)

    if (!guardResult.succeeded) {
      return Result.fail<ConditionCommodityStrategyTag>(guardResult.message)
    }

    const model = new ConditionCommodityStrategyTag({
      ...props,
    })

    return Result.ok<ConditionCommodityStrategyTag>(model)
  }
}
