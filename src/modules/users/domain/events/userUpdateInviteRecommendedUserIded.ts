import { IDomainEvent } from '../../../../shared/domain/events/IDomainEvent'
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID'
import { User } from '../user'

export class UserUpdateInviteRecommendedUserIded implements IDomainEvent {
  public dateTimeOccurred: Date
  public user: User

  constructor(user: User) {
    this.dateTimeOccurred = new Date()
    this.user = user
  }

  getAggregateId(): UniqueEntityID {
    return this.user.id
  }
}
