import { Entity } from '../../../shared/domain/Entity'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { Result } from '../../../shared/core/Result'
import { Guard } from '../../../shared/core/Guard'
import { CommodityType } from '../../commoditys/domain/commodityType'

export interface CommodityItemProps {
  name: string
  amount: number
  commodityId: string
  commodityType: CommodityType
  skuId: string
  specifications: string
}

export class CommodityItem extends Entity<CommodityItemProps> {
  get id(): UniqueEntityID {
    return this._id
  }

  get name(): string {
    return this.props.name
  }

  get amount(): number {
    return this.props.amount
  }

  get commodityId(): string {
    return this.props.commodityId
  }

  get commodityType(): CommodityType {
    return this.props.commodityType
  }

  get skuId(): string {
    return this.props.skuId
  }

  get specifications(): string {
    return this.props.specifications
  }

  public isBargain(): boolean {
    return this.props.commodityType === 'bargain'
  }

  private constructor(props: CommodityItemProps, id?: UniqueEntityID) {
    super(props, id)
  }

  public static create(props: CommodityItemProps, id?: UniqueEntityID): Result<CommodityItem> {
    const nullGuard = Guard.againstNullOrUndefinedBulk([
      { argument: props.name, argumentName: '商品名称' },
      { argument: props.amount, argumentName: '商品价格' },
      { argument: props.commodityId, argumentName: '商品编号' },
      { argument: props.commodityType, argumentName: '商品类型' },
      { argument: props.skuId, argumentName: 'skuId' },
      { argument: props.specifications, argumentName: 'specifications' },
    ])

    if (!nullGuard.succeeded) {
      return Result.fail<CommodityItem>(nullGuard.message)
    }

    const defaultProps: CommodityItemProps = {
      ...props,
    }

    const commodityItem = new CommodityItem(defaultProps, id)

    return Result.ok<CommodityItem>(commodityItem)
  }
}
