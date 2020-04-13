import { Db, MongoClient, Collection } from 'mongodb'

import { Global } from '../../../../shared/infra/database/mongodb'
import { DomainEvents } from '../../../../shared/domain/events/DomainEvents'
import { OrderUserMap } from '../../mappers/orderUserMap'
import { OrderUser } from '../../domain/orderUser'
import { IOrderUserRepo } from '../orderUserRepo'
import { IOrderUserDbModel } from '../../dbModels/orderUserDbModel'

export class MongoOrderUserRepo implements IOrderUserRepo {
  constructor() { }

  private createCollection(): Collection<IOrderUserDbModel> {
    return Global.instance.mongoDb.collection<IOrderUserDbModel>('orderUser')
  }

  public async getById(_id: string): Promise<OrderUser> {
    let orderUser = await this.createCollection().findOne({ _id })
    return OrderUserMap.toDomain(orderUser)
  }

  public async save(orderUser: OrderUser): Promise<void> {
    const raw = await OrderUserMap.toPersistence(orderUser)
    await this.createCollection().updateOne(
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
    let orderUser = await this.createCollection().findOne({ _id })
    return !!orderUser === true
  }

}
