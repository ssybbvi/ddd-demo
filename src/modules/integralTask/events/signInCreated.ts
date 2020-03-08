import { IDomainEvent } from '../../../shared/domain/events/IDomainEvent'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { SignIn } from '../domain/signIn'

export class SignInCreated implements IDomainEvent {
  public dateTimeOccurred: Date
  public signIn: SignIn

  constructor(signIn: SignIn) {
    this.dateTimeOccurred = new Date()
    this.signIn = signIn
  }

  getAggregateId(): UniqueEntityID {
    return this.signIn.id
  }
}
