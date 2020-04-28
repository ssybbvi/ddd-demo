

import { IDomainEvent } from '../../../../shared/domain/events/IDomainEvent'
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID'
import { Participant } from '../participant'
import { Bargain } from '../bargain'

export class BargainParticipantCreated implements IDomainEvent {
  public dateTimeOccurred: Date
  public bargain: Bargain
  public participant: Participant


  constructor(bargain: Bargain, participant: Participant) {
    this.dateTimeOccurred = new Date()
    this.bargain = bargain
    this.participant = participant
  }

  getAggregateId(): UniqueEntityID {
    return this.bargain.id
  }
}


