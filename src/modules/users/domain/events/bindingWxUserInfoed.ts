import { IDomainEvent } from '../../../../shared/domain/events/IDomainEvent'
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID'
import { WxUser } from '../wxUser'

export class BindingWxUserInfoed implements IDomainEvent {
  public dateTimeOccurred: Date
  public wxUser: WxUser

  constructor(wxUser: WxUser) {
    this.dateTimeOccurred = new Date()
    this.wxUser = wxUser
  }

  getAggregateId(): UniqueEntityID {
    return this.wxUser.id
  }
}
