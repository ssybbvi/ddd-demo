import { IDomainEvent } from '../../../../shared/domain/events/IDomainEvent'
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID'
import { UpUser } from '../upUser'

export class UpUserCreated implements IDomainEvent {
  public dateTimeOccurred: Date
  public wxUser: UpUser

  constructor(wxUser: UpUser) {
    this.dateTimeOccurred = new Date()
    this.wxUser = wxUser
  }

  getAggregateId(): UniqueEntityID {
    return this.wxUser.id
  }
}
