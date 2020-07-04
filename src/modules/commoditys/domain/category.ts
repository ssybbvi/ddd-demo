import { AggregateRoot } from '../../../shared/domain/AggregateRoot'
import { Result } from '../../../shared/core/Result'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { IGuardArgument, Guard } from '../../../shared/core/Guard'
import { Attributes } from './attributes'

export interface ICategoryProps {
  name: string
  parentId: string
  attributes: Attributes
}

export class Category extends AggregateRoot<ICategoryProps> {
  private constructor(props: ICategoryProps, id?: UniqueEntityID) {
    super(props, id)
  }

  get name(): string {
    return this.props.name
  }

  get parentId(): string {
    return this.props.parentId
  }

  get attributes(): Attributes {
    return this.props.attributes
  }

  public updateName(name: string) {
    this.props.name = name
  }

  public updateParentId(parentId: string) {
    this.props.parentId = parentId
  }

  public updateAttributes(attributes: Attributes) {
    this.props.attributes = attributes
  }

  public static create(props: ICategoryProps, id?: UniqueEntityID): Result<Category> {
    const guardArgs: IGuardArgument[] = [
      { argument: props.name, argumentName: '名称' },
      { argument: props.attributes, argumentName: 'attributes' },
    ]

    const guardResult = Guard.againstNullOrUndefinedBulk(guardArgs)

    if (!guardResult.succeeded) {
      return Result.fail<Category>(guardResult.message)
    }

    const defaultValues: ICategoryProps = {
      ...props,
    }

    const category = new Category(defaultValues, id)

    const isNew = !!id === false
    if (isNew) {
    }
    return Result.ok<Category>(category)
  }
}
