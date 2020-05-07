import { Db, MongoClient, Collection } from 'mongodb'

import { Global } from '../../../../shared/infra/database/mongodb'
import { DomainEvents } from '../../../../shared/domain/events/DomainEvents'
import { OrderUserMap } from '../../mappers/orderUserMap'
import { OrderUser } from '../../domain/orderUser'
import { IOrderUserRepo } from '../orderUserRepo'
import { IOrderUserDbModel } from '../../dbModels/orderUserDbModel'
import { MongodbWithTenantCollection, MongodbWithTenant } from '../../../../shared/infra/database/mongodb/mongodbTenant'

export class MongoOrderUserRepo implements IOrderUserRepo {
  constructor() { }

  private getCollection(): MongodbWithTenantCollection<IOrderUserDbModel> {
    return MongodbWithTenant.instance.Collection<IOrderUserDbModel>('orderUser')
  }

  public async getById(_id: string): Promise<OrderUser> {
    let orderUser = await this.getCollection().findOne({ _id })
    return OrderUserMap.toDomain(orderUser)
  }

  public async save(orderUser: OrderUser): Promise<void> {
    const raw = await OrderUserMap.toPersistence(orderUser)
    await this.getCollection().updateOne(
      { _id: raw._id },
      {
        $set: {
          isAllowBuyOnceCommodity: raw.isAllowBuyOnceCommodity
        }
      },
      { upsert: true }
    )

    await DomainEvents.dispatchEventsForAggregate(orderUser)
  }

  public async exist(_id: string): Promise<boolean> {
    let orderUser = await this.getCollection().findOne({ _id })
    return !!orderUser === true
  }

}
