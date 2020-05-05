import { Db, MongoClient, Collection } from 'mongodb'

import { Global } from '../../../../shared/infra/database/mongodb'
import { DomainEvents } from '../../../../shared/domain/events/DomainEvents'
import { ICommodityRepo } from '../iCommodityRepo'
import { ICommodityDbModel } from '../../dbModels/commodityDbModel'
import { Commodity } from '../../domain/commodity'
import { CommodityMap } from '../../mappers/commodityMap'

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
          amount: raw.amount,
          description: raw.description,
          images: raw.images,
          fakeAmount: raw.fakeAmount,
          sales: raw.sales,
          restrictedPurchaseQuantity: raw.restrictedPurchaseQuantity,
          limitedPurchasePerPerson: raw.limitedPurchasePerPerson,
          tags: raw.tags,
          imgesDescrptionList: raw.imgesDescrptionList,
          type: raw.type,
        },
      },
      { upsert: true }
    )

    await DomainEvents.dispatchEventsForAggregate(commodity)
  }

  public async exist(_id: string): Promise<boolean> {
    let commodity = await this.createCollection().findOne({ _id })
    return !!commodity === true
  }

  public async filter(name: string, tag: string): Promise<Commodity[]> {
    let query: any = {}

    if (name || tag) {
      query.$and = []
    }

    if (name) {
      query.$and.push({
        name: {
          $regex: name,
        },
      })
    }
    if (tag) {
      query.$and.push({
        tags: {
          $in: [tag],
        },
      })
    }

    let commodityList = await this.createCollection().find(query).toArray()
    return commodityList.map((item) => CommodityMap.toDomain(item))
  }
}
