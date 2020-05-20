import { AggregateRoot } from '../../../shared/domain/AggregateRoot'
import { Result } from '../../../shared/core/Result'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { IGuardArgument, Guard } from '../../../shared/core/Guard'

export interface ICategoryProps {
  name: string
  parentId: string
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

  public updateName(name: string) {
    this.props.name = name
  }

  public updateParentId(parentId: string) {
    this.props.parentId = parentId
  }

  public static create(props: ICategoryProps, id?: UniqueEntityID): Result<Category> {
    const guardArgs: IGuardArgument[] = [
      { argument: props.name, argumentName: '名称' },
      { argument: props.parentId, argumentName: '父节点' },
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
