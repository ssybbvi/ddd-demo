import { AggregateRoot } from '../../../shared/domain/AggregateRoot'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { Result } from '../../../shared/core/Result'
import { MemberId } from './memberId'

export interface iFundAccountProps {
  totalAmounnt: number
}

export class FundAccount extends AggregateRoot<iFundAccountProps> {
  private constructor(props: iFundAccountProps, id?: UniqueEntityID) {
    super(props, id)
  }

  get memberId(): MemberId {
    return MemberId.create(this._id).getValue()
  }

  get totalAmounnt(): number {
    return this.props.totalAmounnt
  }

  public static create(props: iFundAccountProps, id?: UniqueEntityID): Result<FundAccount> {
    const defaultValues: iFundAccountProps = {
      ...props
    }

    const member = new FundAccount(defaultValues, id)

    return Result.ok<FundAccount>(member)
  }
}
