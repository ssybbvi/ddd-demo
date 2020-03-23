import { IDomainEvent } from '../../../../shared/domain/events/IDomainEvent'
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID'
import { RecommendedUser } from '../recommendedUser'

export class RecommendedUserCreated implements IDomainEvent {
  public dateTimeOccurred: Date
  public recommendedUser: RecommendedUser

  constructor(recommendedUser: RecommendedUser) {
    this.dateTimeOccurred = new Date()
    this.recommendedUser = recommendedUser
  }

  getAggregateId(): UniqueEntityID {
    return this.recommendedUser.id
  }
}
