import { AggregateRoot } from '../../../shared/domain/AggregateRoot'
import { Result } from '../../../shared/core/Result'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { IGuardArgument, Guard } from '../../../shared/core/Guard'

export interface IAttributeProps {
  name: string
  categoryId: string
}

export class Attribute extends AggregateRoot<IAttributeProps> {
  private constructor(props: IAttributeProps, id?: UniqueEntityID) {
    super(props, id)
  }

  get name(): string {
    return this.props.name
  }

  get categoryId(): string {
    return this.props.categoryId
  }

  public updateName(name: string) {
    this.props.name = name
  }

  public updateCategoryId(categoryId: string) {
    this.props.categoryId = categoryId
  }

  public static create(props: IAttributeProps, id?: UniqueEntityID): Result<Attribute> {
    const guardArgs: IGuardArgument[] = [
      { argument: props.name, argumentName: '名称' },
      { argument: props.categoryId, argumentName: '分类' },
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
