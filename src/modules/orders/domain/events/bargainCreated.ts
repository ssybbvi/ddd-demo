

import { IDomainEvent } from '../../../../shared/domain/events/IDomainEvent'
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID'
import { Bargain } from '../bargain'

export class BargainCreated implements IDomainEvent {
  public dateTimeOccurred: Date
  public bargain: Bargain


  constructor(bargain: Bargain) {
    this.dateTimeOccurred = new Date()
    this.bargain = bargain
  }

  getAggregateId(): UniqueEntityID {
    return this.bargain.id
  }
}


