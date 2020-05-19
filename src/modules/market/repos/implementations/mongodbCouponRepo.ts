import { MongodbWithTenant, MongodbWithTenantCollection } from '../../../../shared/infra/database/mongodb/mongodbTenant'
import { ICouponRepo } from '../couponRepo'
import { ICouponDbModel } from '../../dbModels/couponDbModel'
import { Coupon } from '../../domain/coupon'
import { CouponMap } from '../../mappers/couponMap'
import { DomainEvents } from '../../../../shared/domain/events/DomainEvents'

export class MongodbCouponRepo implements ICouponRepo {
  constructor() {}

  private getCollection(): MongodbWithTenantCollection<ICouponDbModel> {
    return MongodbWithTenant.instance.Collection<ICouponDbModel>('coupon')
  }

  public async getById(_id: string): Promise<Coupon> {
    let coupon = await this.getCollection().findOne({ _id })
    return CouponMap.toDomain(coupon)
  }

  public async save(coupon: Coupon): Promise<void> {
    const raw = await CouponMap.toPersistence(coupon)
    await this.getCollection().updateOne(
      { _id: raw._id },
      {
        $set: {
          name: raw.name,
          condition: raw.condition,
          reward: raw.reward,
          receiveLimit: raw.receiveLimit,
          userReceiveLimit: raw.userReceiveLimit,
        },
      },
      { upsert: true }
    )
    await DomainEvents.dispatchEventsForAggregate(coupon)
  }

  public async filter(): Promise<Coupon[]> {
    const list = await this.getCollection().find().toArray()
    return list.map((item) => CouponMap.toDomain(item))
  }
}
