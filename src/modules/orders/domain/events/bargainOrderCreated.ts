

import { IDomainEvent } from '../../../../shared/domain/events/IDomainEvent'
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID'
import { BargainOrder } from '../bargainOrder'

export class BargainOrderCreated implements IDomainEvent {
  public dateTimeOccurred: Date
  public bargainOrder: BargainOrder


  constructor(bargainOrder: BargainOrder) {
    this.dateTimeOccurred = new Date()
    this.bargainOrder = bargainOrder
  }

  getAggregateId(): UniqueEntityID {
    return this.bargainOrder.id
  }
}


