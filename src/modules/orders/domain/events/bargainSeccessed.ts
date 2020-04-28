

import { IDomainEvent } from '../../../../shared/domain/events/IDomainEvent'
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID'
import { Participant } from '../participant'
import { Bargain } from '../bargain'

export class BargainSeccessed implements IDomainEvent {
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


