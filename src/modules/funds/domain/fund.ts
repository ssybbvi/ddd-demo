import { FundAmount, IFundAmountProps } from './fundAmount'
import { FundStatus } from './fundStatus'
import { AggregateRoot } from '../../../shared/domain/AggregateRoot'
import { Result } from '../../../shared/core/Result'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { IGuardArgument, Guard } from '../../../shared/core/Guard'
import { FundType } from './fundType'
import { FundCreated } from './events/fundCreated'
import { FundId } from './fundId'
import { FundFreezed } from './events/fundFreezed'
import { FundInvalided } from './events/fundInvalided'
import { FundValided } from './events/fundValided'

export interface IFundProps {
  amount: FundAmount
  status?: FundStatus
  incomeUserId?: string
  paymentUserId?: string
  createAt?: number
  descrpiton?: string
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

  get incomeUserId(): string {
    return this.props.incomeUserId
  }

  get paymentUserId(): string {
    return this.props.paymentUserId
  }

  get createAt(): number {
    return this.props.createAt
  }

  get description(): string {
    return this.props.descrpiton
  }

  get type(): FundType {
    return this.props.type
  }

  get relationId(): string {
    return this.props.relationId
  }

  public toFreeze() {
    this.props.status = 'freeze'
    this.addDomainEvent(new FundFreezed(this))
  }

  public toValid() {
    this.props.status = 'valid'
    this.addDomainEvent(new FundValided(this))
  }

  public toInvalid() {
    this.props.status = 'invalid'
    this.addDomainEvent(new FundInvalided(this))
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
      { argument: props.amount, argumentName: '资金金额' },
      { argument: props.type, argumentName: '资金类型' },
      { argument: props.relationId, argumentName: '资金关联记录' },
    ]

    const guardResult = Guard.againstNullOrUndefinedBulk(guardArgs)

    if (!guardResult.succeeded) {
      return Result.fail<Fund>(guardResult.message)
    }

    const defaultValues: IFundProps = {
      ...props,
      createAt: props.createAt ? props.createAt : Date.now(),
      status: props.status ? props.status : 'valid',
      descrpiton: props.descrpiton ? props.descrpiton : "",
      incomeUserId: props.incomeUserId ? props.incomeUserId : "0",
      paymentUserId: props.paymentUserId ? props.paymentUserId : "0",
    }

    const fund = new Fund(defaultValues, id)

    const isNew = !!id === false
    if (isNew) {
      fund.addDomainEvent(new FundCreated(fund))
    }
    return Result.ok<Fund>(fund)
  }
}
