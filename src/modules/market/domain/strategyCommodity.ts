import { AggregateRoot } from '../../../shared/domain/AggregateRoot'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { CommodityType } from '../../commoditys/domain/commodityType'
import { IGuardArgument, Guard } from '../../../shared/core/Guard'
import { Result } from '../../../shared/core/Result'

export interface IStrategyCommodityProps {
  name: string
  commodityId: string
  skuId: string
  type: CommodityType
  strategyTag: string[]
  amount: number
}

export class StrategyCommodity extends AggregateRoot<IStrategyCommodityProps> {
  private constructor(props: IStrategyCommodityProps, id?: UniqueEntityID) {
    super(props, id)
  }

  get name(): string {
    return this.props.name
  }

  get commodityId(): string {
    return this.props.commodityId
  }

  get skuId(): string {
    return this.props.skuId
  }

  get type(): CommodityType {
    return this.props.type
  }

  get strategyTag(): string[] {
    return this.props.strategyTag
  }

  get amount(): number {
    return this.props.amount
  }

  public static create(props: IStrategyCommodityProps, id?: UniqueEntityID): Result<StrategyCommodity> {
    const guardArgs: IGuardArgument[] = [
      { argument: props.name, argumentName: '名称' },
      { argument: props.commodityId, argumentName: '商品编号' },
      { argument: props.skuId, argumentName: 'skuId' },
      { argument: props.type, argumentName: '商品类型' },
      { argument: props.strategyTag, argumentName: '策略标签' },
      { argument: props.amount, argumentName: '金额' },
    ]

    const guardResult = Guard.againstNullOrUndefinedBulk(guardArgs)

    if (!guardResult.succeeded) {
      return Result.fail<StrategyCommodity>(guardResult.message)
    }

    const defaultValues: IStrategyCommodityProps = {
      ...props,
    }

    const model = new StrategyCommodity(defaultValues, id)

    return Result.ok<StrategyCommodity>(model)
  }
}
