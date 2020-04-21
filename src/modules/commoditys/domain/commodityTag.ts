import { AggregateRoot } from '../../../shared/domain/AggregateRoot'
import { Result } from '../../../shared/core/Result'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { IGuardArgument, Guard } from '../../../shared/core/Guard'


export interface ICommodityTagProps {
  tag: string
  name: string
  description: string
}

export class CommodityTag extends AggregateRoot<ICommodityTagProps> {
  private constructor(props: ICommodityTagProps, id?: UniqueEntityID) {
    super(props, id)
  }

  get name(): string {
    return this.props.name
  }

  get description(): string {
    return this.props.description
  }

  get tag(): string {
    return this.props.tag
  }

  public updateName(name: string) {
    this.props.name = name
  }

  public updateDescrption(description: string) {
    this.props.description = description
  }


  public static create(props: ICommodityTagProps, id?: UniqueEntityID): Result<CommodityTag> {
    const guardArgs: IGuardArgument[] = [
      { argument: props.name, argumentName: '名称' },
      { argument: props.description, argumentName: '描述' },
      { argument: props.tag, argumentName: '标签' },
    ]

    const guardResult = Guard.againstNullOrUndefinedBulk(guardArgs)

    if (!guardResult.succeeded) {
      return Result.fail<CommodityTag>(guardResult.message)
    }

    const defaultValues: ICommodityTagProps = {
      ...props,

    }

    const commodityTag = new CommodityTag(defaultValues, id)

    const isNew = !!id === false
    if (isNew) {
    }
    return Result.ok<CommodityTag>(commodityTag)
  }
}
