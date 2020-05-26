import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { IGuardArgument, Guard } from '../../../shared/core/Guard'
import { Entity } from '../../../shared/domain/Entity'
import { Specifications } from './specifications'
import { Result } from '../../../shared/core/Result'

export interface IAttributeProps {
  name: string
  specifications: Specifications
}

export class Attribute extends Entity<IAttributeProps> {
  private constructor(props: IAttributeProps, id?: UniqueEntityID) {
    super(props, id)
  }

  get id(): UniqueEntityID {
    return this._id
  }

  get name(): string {
    return this.props.name
  }

  get specifications(): Specifications {
    return this.props.specifications
  }

  public updateName(name: string) {
    this.props.name = name
  }

  public updateCategoryId(specifications: Specifications) {
    this.props.specifications = specifications
  }

  public static create(props: IAttributeProps, id?: UniqueEntityID): Result<Attribute> {
    const guardArgs: IGuardArgument[] = [
      { argument: props.name, argumentName: '名称' },
      { argument: props.specifications, argumentName: 'specifications' },
    ]

    const guardResult = Guard.againstNullOrUndefinedBulk(guardArgs)

    if (!guardResult.succeeded) {
      return Result.fail<Attribute>(guardResult.message)
    }

    const defaultValues: IAttributeProps = {
      ...props,
    }

    const attribute = new Attribute(defaultValues, id)

    const isNew = !!id === false
    if (isNew) {
    }
    return Result.ok<Attribute>(attribute)
  }
}
