import { FundAmount, IFundAmountProps } from './fundAmount'
import { FundStatus } from './fundStatus'
import { MemberId } from '../../distribution/domain/memberId'
import { AggregateRoot } from '../../../shared/domain/AggregateRoot'
import { FundId } from './fundId'
import { Result } from '../../../shared/core/Result'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { IGuardArgument, Guard } from '../../../shared/core/Guard'
import { FundType } from './fundType'

export interface IFundProps {
  amount: FundAmount
  status: FundStatus
  incomeMemberId: MemberId
  paymentMemberId: MemberId
  createAt: number
  descrpiton: string
  type: FundType
  relationId: string
}

export class Fund extends AggregateRoot<IFundProps> {
  private constructor(props: IFundProps, id?: UniqueEntityID) {
    super(props, id)
  }

  get fundId(): FundId {
    return FundId.create(this._id).getValue()
  }

  get status(): FundStatus {
    return this.props.status
  }

  get amount(): FundAmount {
    return this.props.amount
  }

  get incomeMemberId(): MemberId {
    return this.props.incomeMemberId
  }

  get paymentMemberId(): MemberId {
    return this.props.paymentMemberId
  }

  get createAt(): number {
    return this.props.createAt
  }

  get descrption(): string {
    return this.props.descrpiton
  }

  get type(): FundType {
    return this.props.type
  }

  get relationId(): string {
    return this.props.relationId
  }

  public toFreeze(): Result<void> {
    this.props.status = 'freeze'
    return Result.ok<void>()
  }

  public toValid(): Result<void> {
    this.props.status = 'valid'
    return Result.ok<void>()
  }

  public toInvalid(): Result<void> {
    this.props.status = 'invalid'
    return Result.ok<void>()
  }

  public isFreeze(): boolean {
    return this.props.status === 'freeze'
  }

  public isValid(): boolean {
    return this.props.status === 'valid'
  }

  public isInValid(): boolean {
    return this.props.status === 'invalid'
  }

  public static create(props: IFundProps, id?: UniqueEntityID): Result<Fund> {
    const guardArgs: IGuardArgument[] = [
      { argument: props.status, argumentName: '资金状态' },
      { argument: props.amount, argumentName: '资金金额' },
      { argument: props.paymentMemberId, argumentName: '支付用户' },
      { argument: props.incomeMemberId, argumentName: '收入用户' },
      { argument: props.type, argumentName: '资金类型' },
      { argument: props.relationId, argumentName: '资金关联记录' },
      { argument: props.descrpiton, argumentName: '资金描述' }
    ]

    const guardResult = Guard.againstNullOrUndefinedBulk(guardArgs)

    if (!guardResult.succeeded) {
      return Result.fail<Fund>(guardResult.message)
    }

    const defaultValues: IFundProps = {
      ...props,
      createAt: Date.now()
    }

    const fund = new Fund(defaultValues, id)
    return Result.ok<Fund>(fund)
  }
}
