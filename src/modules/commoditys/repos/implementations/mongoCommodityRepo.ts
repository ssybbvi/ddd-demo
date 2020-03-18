import { Db, MongoClient, Collection } from 'mongodb'

import { Global } from '../../../../shared/infra/database/mongodb'
import { DomainEvents } from '../../../../shared/domain/events/DomainEvents'
import { ICommodityRepo } from '../iCommodityRepo'
import { ICommodityDbModel } from '../../dbModels/commodityDbModel'
import { Commodity } from '../../domain/commodity'
import { CommodityMap } from '../../mappers/CommodityMap'

export class MongoCommodityRepo implements ICommodityRepo {
  constructor() {}

  private createCollection(): Collection<ICommodityDbModel> {
    return Global.instance.mongoDb.collection<ICommodityDbModel>('commodity')
  }

  public async getById(_id: string): Promise<Commodity> {
    let commodity = await this.createCollection().findOne({ _id })
    return CommodityMap.toDomain(commodity)
  }

  public async save(commodity: Commodity): Promise<void> {
    const raw = await CommodityMap.toPersistence(commodity)
    await this.createCollection().updateOne(
      { _id: raw._id },
      {
        $set: {
          name: raw.name,
          price: raw.price,
          descrption: raw.descrption,
          images: raw.images,
          fakePrice: raw.fakePrice,
          sales: raw.sales,
          restrictedPurchaseQuantity: raw.restrictedPurchaseQuantity,
          tags: raw.tags
        }
      },
      { upsert: true }
    )

    DomainEvents.dispatchEventsForAggregate(commodity)
  }

  public async exist(_id: string): Promise<boolean> {
    let commodity = await this.createCollection().findOne({ _id })
    return !!commodity === true
  }

  public async filter(): Promise<Commodity[]> {
    let commodityList = await this.createCollection()
      .find({})
      .toArray()
    return commodityList.map(item => CommodityMap.toDomain(item))
  }
}
