import { Db, MongoClient, Collection } from 'mongodb'

import { Global } from '../../../../shared/infra/database/mongodb'
import { DomainEvents } from '../../../../shared/domain/events/DomainEvents'
import { BargainMap } from '../../mappers/bargainMap'
import { Bargain } from '../../domain/bargain'
import { IBargainDbModel } from '../../dbModels/bargainDbModel'
import { IBargainRepo } from '../bargainRepo'

export class MongoBargainRepo implements IBargainRepo {
  constructor() { }

  private createCollection(): Collection<IBargainDbModel> {
    return Global.instance.mongoDb.collection<IBargainDbModel>('bargain')
  }

  public async getById(_id: string): Promise<Bargain> {
    let bargain = await this.createCollection().findOne({ _id })
    return BargainMap.toDomain(bargain)
  }

  public async save(bargain: Bargain): Promise<void> {
    const raw = await BargainMap.toPersistence(bargain)
    await this.createCollection().updateOne(
      { _id: raw._id },
      {
        $set: {
          commodityId: raw.commodityId,
          name: raw.name,
          currentPrice: raw.currentPrice,
          price: raw.price,
          isSuccess: raw.isSuccess,
          createAt: raw.createAt,
          finishAt: raw.finishAt,
          expiredAt: raw.expiredAt,
          participants: raw.participants,
          deliveryInfo: raw.deliveryInfo,
        }
      },
      { upsert: true }
    )

    await DomainEvents.dispatchEventsForAggregate(bargain)
  }

  public async exist(_id: string): Promise<boolean> {
    let bargain = await this.createCollection().findOne({ _id })
    return !!bargain === true
  }

  public async  filter(userId?: string): Promise<Bargain[]> {
    const list = await this.createCollection().find({ userId }).toArray()
    return list.map(item => BargainMap.toDomain(item))
  }

}
