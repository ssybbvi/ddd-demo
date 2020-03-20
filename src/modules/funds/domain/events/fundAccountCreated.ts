import { IDomainEvent } from '../../../../shared/domain/events/IDomainEvent'
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID'
import { FundAccount } from '../fundAccount'

export class FundAccountCreated implements IDomainEvent {
  public dateTimeOccurred: Date
  public fundAccount: FundAccount

  constructor(fundAccount: FundAccount) {
    this.dateTimeOccurred = new Date()
    this.fundAccount = fundAccount
  }

  getAggregateId(): UniqueEntityID {
    return this.fundAccount.id
  }
}
