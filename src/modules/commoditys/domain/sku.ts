import { Result } from '../../../shared/core/Result'
import { Entity } from '../../../shared/domain/Entity'
import { SkuSpecification } from './skuSpecification'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { IGuardArgument, Guard } from '../../../shared/core/Guard'

export interface ISkuProps {
  name: string
  code: string
  price: number
  stock: number
  isSufficient: boolean
  combines: SkuSpecification[]
}

export class Sku extends Entity<ISkuProps> {
  private constructor(props: ISkuProps, id?: UniqueEntityID) {
    super(props, id)
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

  public static create(props: ISkuProps, id?: UniqueEntityID): Result<Sku> {
    const guardArgs: IGuardArgument[] = [
      { argument: props.name, argumentName: 'name' },
      { argument: props.code, argumentName: 'code' },
      { argument: props.price, argumentName: 'price' },
      { argument: props.stock, argumentName: 'stock' },
      { argument: props.isSufficient, argumentName: 'isSufficient' },
      { argument: props.combines, argumentName: 'combines' },
    ]

    const guardResult = Guard.againstNullOrUndefinedBulk(guardArgs)

    if (!guardResult.succeeded) {
      return Result.fail<Sku>(guardResult.message)
    }

    const defaultProps: ISkuProps = {
      ...props,
    }

    const model = new Sku(defaultProps, id)
    return Result.ok<Sku>(model)
  }
}
