import { AggregateRoot } from '../../../shared/domain/AggregateRoot'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { Result } from '../../../shared/core/Result'
import { FundAccountCreated } from './events/fundAccountCreated'

export interface iFundAccountProps {
  totalAmounnt: number
}

export class FundAccount extends AggregateRoot<iFundAccountProps> {
  private constructor(props: iFundAccountProps, id?: UniqueEntityID) {
    super(props, id)
  }

  get totalAmounnt(): number {
    return this.props.totalAmounnt
  }

  public static create(props: iFundAccountProps, id?: UniqueEntityID,isAddDomainEvent: boolean = false): Result<FundAccount> {
    const defaultValues: iFundAccountProps = {
      ...props
    }

    const fundAccount = new FundAccount(defaultValues, id)

    const isNew = !!id === false
    if (isNew||isAddDomainEvent) {
      fundAccount.addDomainEvent(new FundAccountCreated(fundAccount))
    }

    return Result.ok<FundAccount>(fundAccount)
  }
}
