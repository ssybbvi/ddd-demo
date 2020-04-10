import { Result } from '../../../shared/core/Result'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { IGuardArgument, Guard } from '../../../shared/core/Guard'
import { AggregateRoot } from '../../../shared/domain/AggregateRoot'

export interface IPurchaseHistoryProps {
  userId: string
  commodityId: string
  nickName: string
  craeteAt?: number
  avatarUrl: string
  gender: number
}

export class PurchaseHistory extends AggregateRoot<IPurchaseHistoryProps> {
  private constructor(props: IPurchaseHistoryProps, id?: UniqueEntityID) {
    super(props, id)
  }

  get userId(): string {
    return this.props.userId
  }

  get commodityId(): string {
    return this.props.commodityId
  }

  get nickName(): string {
    return this.props.nickName
  }

  get craeteAt(): number {
    return this.props.craeteAt
  }

  get avatarUrl(): string {
    return this.props.avatarUrl
  }

  get gender(): number {
    return this.props.gender
  }

  public static create(props: IPurchaseHistoryProps, id?: UniqueEntityID): Result<PurchaseHistory> {
    const guardArgs: IGuardArgument[] = [
      { argument: props.commodityId, argumentName: '商品编号' },
      { argument: props.userId, argumentName: '用户编号' }
    ]

    const guardResult = Guard.againstNullOrUndefinedBulk(guardArgs)

    if (!guardResult.succeeded) {
      return Result.fail<PurchaseHistory>(guardResult.message)
    }

    const defaultValues: IPurchaseHistoryProps = {
      ...props,
      craeteAt: props.craeteAt ? props.craeteAt : Date.now()
    }

    const commodityPurchaseHistory = new PurchaseHistory(defaultValues, id)
    return Result.ok<PurchaseHistory>(commodityPurchaseHistory)
  }
}
