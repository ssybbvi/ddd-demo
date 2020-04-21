import { Db, MongoClient, Collection } from 'mongodb'

import { Global } from '../../../../shared/infra/database/mongodb'
import { DomainEvents } from '../../../../shared/domain/events/DomainEvents'
import { ICommodityTagRepo } from '../iCommodityTagRepo'
import { ICommodityTagDbModel } from '../../dbModels/commodityTagDbModel'
import { CommodityTag } from '../../domain/commodityTag'
import { CommodityTagMap } from '../../mappers/commodityTagMap'

export class MongoCommodityTagRepo implements ICommodityTagRepo {
  constructor() { }

  private createCollection(): Collection<ICommodityTagDbModel> {
    return Global.instance.mongoDb.collection<ICommodityTagDbModel>('commodityTag')
  }

  public async getById(_id: string): Promise<CommodityTag> {
    let commodityTag = await this.createCollection().findOne({ _id })
    console.log("zzzzz", commodityTag)
    return CommodityTagMap.toDomain(commodityTag)
  }

  public async save(commodityTag: CommodityTag): Promise<void> {
    const raw = await CommodityTagMap.toPersistence(commodityTag)
    await this.createCollection().updateOne(
      { _id: raw._id },
      {
        $set: {
          name: raw.name,
          description: raw.description,
          tag: raw.tag
        }
      },
      { upsert: true }
    )

    await DomainEvents.dispatchEventsForAggregate(commodityTag)
  }

  public async existTag(tag: string): Promise<boolean> {
    let commodityTag = await this.createCollection().findOne({ tag })
    return !!commodityTag === true
  }

  public async filter(): Promise<CommodityTag[]> {
    let commodityTagList = await this.createCollection()
      .find({})
      .toArray()
    return commodityTagList.map(item => CommodityTagMap.toDomain(item))
  }
}
