import { IDomainEvent } from '../../../../shared/domain/events/IDomainEvent'
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID'
import { AuthorityUser } from '../authorityUser'

export class AuthorityUserCreated implements IDomainEvent {
  public dateTimeOccurred: Date
  public authorityUser: AuthorityUser

  constructor(authorityUser: AuthorityUser) {
    this.dateTimeOccurred = new Date()
    this.authorityUser = authorityUser
  }

  getAggregateId(): UniqueEntityID {
    return this.authorityUser.id
  }
}
