import { User } from '../user'
import { IDomainEvent } from '../../../../shared/domain/events/IDomainEvent'
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID'

export class UserCreated implements IDomainEvent {
  public dateTimeOccurred: Date
  public user: User
  public extra?: UserCreatedEventExtra

  constructor(user: User, extra?: UserCreatedEventExtra) {
    this.dateTimeOccurred = new Date()
    this.user = user
    this.extra = extra
  }

  getAggregateId(): UniqueEntityID {
    return this.user.id
  }
}

export interface UserCreatedEventExtra {
  inviteToken: string
}
