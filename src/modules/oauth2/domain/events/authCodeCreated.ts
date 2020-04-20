import { IDomainEvent } from '../../../../shared/domain/events/IDomainEvent'
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID'
import { AuthCode } from '../authCode'

export class AuthCodeCreated implements IDomainEvent {
  public dateTimeOccurred: Date
  public authCode: AuthCode

  constructor(authCode: AuthCode) {
    this.dateTimeOccurred = new Date()
    this.authCode = authCode
  }

  getAggregateId(): UniqueEntityID {
    return this.authCode.id
  }
}
