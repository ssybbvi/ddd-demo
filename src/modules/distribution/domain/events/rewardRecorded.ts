import { IDomainEvent } from '../../../../shared/domain/events/IDomainEvent'
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID'
import { Member } from '../member'

export class RewardRecorded implements IDomainEvent {
  public dateTimeOccurred: Date
  public member: Member
  public extra: RewardRecordedExtra

  constructor(member: Member, extra: RewardRecordedExtra) {
    this.dateTimeOccurred = new Date()
    this.member = member
    this.extra = extra
  }

  getAggregateId(): UniqueEntityID {
    return this.member.id
  }
}

export interface RewardRecordedExtra {
  signIn?: {
    userId: string
    reward: number
  }
}
