import { IDomainEvent } from '../../../../shared/domain/events/IDomainEvent'
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID'
import { Fund } from '../fund'

export class FundInvalided implements IDomainEvent {
  public dateTimeOccurred: Date
  public fund: Fund

  constructor(fund: Fund) {
    this.dateTimeOccurred = new Date()
    this.fund = fund
  }

  getAggregateId(): UniqueEntityID {
    return this.fund.id
  }
}
