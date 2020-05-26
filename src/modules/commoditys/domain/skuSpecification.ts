import { ValueObject } from '../../../shared/domain/ValueObject'
import { Result } from '../../../shared/core/Result'
import { IGuardArgument, Guard } from '../../../shared/core/Guard'

export interface ISkuSpecificationProps {
  attributeId: string
  specificationId: string
}

export class SkuSpecification extends ValueObject<ISkuSpecificationProps> {
  private constructor(props: ISkuSpecificationProps) {
    super(props)
  }

  get attributeId(): string {
    return this.props.attributeId
  }

  get specificationId(): string {
    return this.props.specificationId
  }

  public static create(props: ISkuSpecificationProps): Result<SkuSpecification> {
    const guardArgs: IGuardArgument[] = [
      { argument: props.attributeId, argumentName: '属性编号' },
      { argument: props.specificationId, argumentName: '规格编号' },
    ]

    const guardResult = Guard.againstNullOrUndefinedBulk(guardArgs)

    if (!guardResult.succeeded) {
      return Result.fail<SkuSpecification>(guardResult.message)
    }

    const defaultProps: ISkuSpecificationProps = {
      ...props,
    }

    const model = new SkuSpecification(defaultProps)
    return Result.ok<SkuSpecification>(model)
  }
}
