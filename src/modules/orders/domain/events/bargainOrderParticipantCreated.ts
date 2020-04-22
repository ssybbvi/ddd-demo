

import { IDomainEvent } from '../../../../shared/domain/events/IDomainEvent'
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID'
import { Participant } from '../participant'
import { BargainOrder } from '../bargainOrder'

export class BargainOrderParticipantCreated implements IDomainEvent {
  public dateTimeOccurred: Date
  public bargainOrder: BargainOrder
  public participant: Participant


  constructor(bargainOrder: BargainOrder, participant: Participant) {
    this.dateTimeOccurred = new Date()
    this.bargainOrder = bargainOrder
    this.participant = participant
  }

  getAggregateId(): UniqueEntityID {
    return this.bargainOrder.id
  }
}


