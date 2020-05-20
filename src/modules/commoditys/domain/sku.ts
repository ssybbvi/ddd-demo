import { Result } from '../../../shared/core/Result'
import { Entity } from '../../../shared/domain/Entity'
import { SkuSpecification } from './skuSpecification'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'

export interface ISkuProps {
  name: string
  code: string
  price: number
  stock: number
  isSufficient: boolean
  combines: SkuSpecification[]
}

export class Sku extends Entity<ISkuProps> {
  private constructor(props: ISkuProps) {
    super(props)
  }

  get id(): UniqueEntityID {
    return this._id
  }

  get name(): string {
    return this.props.name
  }

  get code(): string {
    return this.props.code
  }

  get price(): number {
    return this.props.price
  }

  get stock(): number {
    return this.props.stock
  }

  get isSufficient(): boolean {
    return this.props.isSufficient
  }

  get combines(): SkuSpecification[] {
    return this.props.combines
  }

  public static create(props: ISkuProps): Result<Sku> {
    const defaultProps: ISkuProps = {
      ...props,
    }

    const model = new Sku(defaultProps)
    return Result.ok<Sku>(model)
  }
}
