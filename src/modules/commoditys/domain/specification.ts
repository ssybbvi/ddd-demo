import { AggregateRoot } from '../../../shared/domain/AggregateRoot'
import { Result } from '../../../shared/core/Result'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { IGuardArgument, Guard } from '../../../shared/core/Guard'

export interface ISpecificationProps {
  name: string
  attributeId: string
  icon: string
}

export class Specification extends AggregateRoot<ISpecificationProps> {
  private constructor(props: ISpecificationProps, id?: UniqueEntityID) {
    super(props, id)
  }

  get name(): string {
    return this.props.name
  }

  get attributeId(): string {
    return this.props.attributeId
  }

  get icon(): string {
    return this.props.icon
  }

  public updateName(name: string) {
    this.props.name = name
  }

  public updateAttributeId(attributeId: string) {
    this.props.attributeId = attributeId
  }

  public updateIconn(icon: string) {
    this.props.icon = icon
  }

  public static create(props: ISpecificationProps, id?: UniqueEntityID): Result<Specification> {
    const guardArgs: IGuardArgument[] = [
      { argument: props.name, argumentName: '名称' },
      { argument: props.attributeId, argumentName: '属性编号' },
      { argument: props.icon, argumentName: 'ICON' },
    ]

    const guardResult = Guard.againstNullOrUndefinedBulk(guardArgs)

    if (!guardResult.succeeded) {
      return Result.fail<Specification>(guardResult.message)
    }

    const defaultValues: ISpecificationProps = {
      ...props,
    }

    const specification = new Specification(defaultValues, id)

    const isNew = !!id === false
    if (isNew) {
    }
    return Result.ok<Specification>(specification)
  }
}
