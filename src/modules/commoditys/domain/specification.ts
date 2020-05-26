import { AggregateRoot } from '../../../shared/domain/AggregateRoot'
import { Result } from '../../../shared/core/Result'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { IGuardArgument, Guard } from '../../../shared/core/Guard'
import { Entity } from '../../../shared/domain/Entity'

export interface ISpecificationProps {
  name: string
  icon: string
}

export class Specification extends Entity<ISpecificationProps> {
  private constructor(props: ISpecificationProps, id?: UniqueEntityID) {
    super(props, id)
  }

  get id(): UniqueEntityID {
    return this._id
  }

  get name(): string {
    return this.props.name
  }

  get icon(): string {
    return this.props.icon
  }

  public updateName(name: string) {
    this.props.name = name
  }

  public updateIconn(icon: string) {
    this.props.icon = icon
  }

  public static create(props: ISpecificationProps, id?: UniqueEntityID): Result<Specification> {
    const guardArgs: IGuardArgument[] = [
      { argument: props.name, argumentName: '名称' },
      { argument: props.icon, argumentName: 'icon' },
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
