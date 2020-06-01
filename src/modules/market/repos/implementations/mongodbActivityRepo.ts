import { MongodbWithTenant, MongodbWithTenantCollection } from '../../../../shared/infra/database/mongodb/mongodbTenant'
import { IActivityRepo } from '../activityRepo'
import { Activity } from '../../domain/activity'
import { DomainEvents } from '../../../../shared/domain/events/DomainEvents'
import { IActivityDbModel } from '../../dbModels/activityDbModel'
import { ActivityMap } from '../../mappers/activityMap'

export class MongodbActivityRepo implements IActivityRepo {
  constructor() {}

  private getCollection(): MongodbWithTenantCollection<IActivityDbModel> {
    return MongodbWithTenant.instance.Collection<IActivityDbModel>('activity')
  }

  public async getById(_id: string): Promise<Activity> {
    let activity = await this.getCollection().findOne({ _id })
    return ActivityMap.toDomain(activity)
  }

  public async save(activity: Activity): Promise<void> {
    const raw = await ActivityMap.toPersistence(activity)
    await this.getCollection().updateOne(
      { _id: raw._id },
      {
        $set: {
          isEnable: raw.isEnable,
          strategy: raw.strategy,
        },
      },
      { upsert: true }
    )
    await DomainEvents.dispatchEventsForAggregate(activity)
  }

  public async filter(): Promise<Activity[]> {
    const list = await this.getCollection().find().toArray()
    return list.map((item) => ActivityMap.toDomain(item))
  }

  public async filterByEnable(): Promise<Activity[]> {
    const list = await this.getCollection().find({ isEnable: true }).toArray()
    return list.map((item) => ActivityMap.toDomain(item))
  }
}
