import { IDomainEvent } from '../../../../shared/domain/events/IDomainEvent'
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID'
import { Commodity } from '../commodity'

export class CommodityCreated implements IDomainEvent {
  public dateTimeOccurred: Date
  public commodity: Commodity

  constructor(commodity: Commodity) {
    this.dateTimeOccurred = new Date()
    this.commodity = commodity
  }

  getAggregateId(): UniqueEntityID {
    return this.commodity.id
  }
}
