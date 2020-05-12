
import { MongodbWithTenant, MongodbWithTenantCollection } from '../../../../shared/infra/database/mongodb/mongodbTenant'
import { ICouponUserRepo } from '../couponUserRepo'
import { ICouponUserDbModel } from '../../dbModels/couponUserDbModel'
import { CouponUser } from '../../domain/couponUser'
import { DomainEvents } from '../../../../shared/domain/events/DomainEvents'
import { CouponUserMap } from '../../mappers/couponUserMap'

export class MongodbCouponUserRepo implements ICouponUserRepo {

  private getCollection(): MongodbWithTenantCollection<ICouponUserDbModel> {
    return MongodbWithTenant.instance.Collection<ICouponUserDbModel>('couponUser')
  }

  public async getById(_id: string): Promise<CouponUser> {
    let couponUser = await this.getCollection().findOne({ _id })
    return CouponUserMap.toDomain(couponUser)
  }

  public async save(couponUser: CouponUser): Promise<void> {
    const raw = await CouponUserMap.toPersistence(couponUser)
    await this.getCollection().updateOne(
      { _id: raw._id },
      {
        $set: {
          couponId: raw.couponId,
          userId: raw.userId,
          isUse: raw.isUse,
          useAt: raw.useAt,
        }
      },
      { upsert: true }
    )
    await DomainEvents.dispatchEventsForAggregate(couponUser)
  }

  public async filter(): Promise<CouponUser[]> {
    const list = await this.getCollection().find().toArray()
    return list.map((item) => CouponUserMap.toDomain(item))
  }

  public async getByCouponIdWithUserIdAndUnused(userId: string, couponId: string): Promise<CouponUser> {
    let couponUser = await this.getCollection().findOne({ userId, couponId, isUse: false })
    return CouponUserMap.toDomain(couponUser)
  }

}
