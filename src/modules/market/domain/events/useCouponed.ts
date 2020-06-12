import { IDomainEvent } from '../../../../shared/domain/events/IDomainEvent'
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID'
import { CouponUser } from '../couponUser'

export class UseCouponed implements IDomainEvent {
  public dateTimeOccurred: Date
  public couponUser: CouponUser

  constructor(couponUser: CouponUser) {
    this.dateTimeOccurred = new Date()
    this.couponUser = couponUser
  }

  getAggregateId(): UniqueEntityID {
    return this.couponUser.id
  }
}
