import { IDomainEvent } from '../../../../shared/domain/events/IDomainEvent'
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID'
import { Order } from '../order'

export class OrderPaymented implements IDomainEvent {
  public dateTimeOccurred: Date
  public order: Order

  constructor(order: Order) {
    this.dateTimeOccurred = new Date()
    this.order = order
  }

  getAggregateId(): UniqueEntityID {
    return this.order.id
  }
}

 
