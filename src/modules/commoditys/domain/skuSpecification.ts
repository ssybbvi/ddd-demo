import { ValueObject } from '../../../shared/domain/ValueObject'
import { Result } from '../../../shared/core/Result'

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
    const defaultProps: ISkuSpecificationProps = {
      ...props,
    }

    const model = new SkuSpecification(defaultProps)
    return Result.ok<SkuSpecification>(model)
  }
}
