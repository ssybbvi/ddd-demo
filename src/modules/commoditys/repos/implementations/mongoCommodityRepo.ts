import { DomainEvents } from '../../../../shared/domain/events/DomainEvents'
import { ICommodityRepo } from '../iCommodityRepo'
import { ICommodityDbModel } from '../../dbModels/commodityDbModel'
import { Commodity } from '../../domain/commodity'
import { CommodityMap } from '../../mappers/commodityMap'
import { MongodbWithTenantCollection, MongodbWithTenant } from '../../../../shared/infra/database/mongodb/mongodbTenant'

export class MongoCommodityRepo implements ICommodityRepo {
  constructor() {}

  private getCollection(): MongodbWithTenantCollection<ICommodityDbModel> {
    return MongodbWithTenant.instance.Collection<ICommodityDbModel>('commodity')
  }

  public async getById(_id: string): Promise<Commodity> {
    let commodity = await this.getCollection().findOne({ _id })
    return CommodityMap.toDomain(commodity)
  }

  public async save(commodity: Commodity): Promise<void> {
    const raw = await CommodityMap.toPersistence(commodity)
    await this.getCollection().updateOne(
      { _id: raw._id },
      {
        $set: {
          name: raw.name,
          description: raw.description,
          images: raw.images,
          fakeAmount: raw.fakeAmount,
          sales: raw.sales,
          restrictedPurchaseQuantity: raw.restrictedPurchaseQuantity,
          limitedPurchasePerPerson: raw.limitedPurchasePerPerson,
          tags: raw.tags,
          imgesDescrptionList: raw.imgesDescrptionList,
          type: raw.type,
          strategyTags: raw.strategyTags,
          categoryId: raw.categoryId,
          skus: raw.skus,
          attributes: raw.attributes,
        },
      },
      { upsert: true }
    )

    await DomainEvents.dispatchEventsForAggregate(commodity)
  }

  public async exist(_id: string): Promise<boolean> {
    let commodity = await this.getCollection().findOne({ _id })
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

    let commodityList = await this.getCollection().find(query).toArray()
    return commodityList.map((item) => CommodityMap.toDomain(item))
  }

  public async filterBySkuIds(skuIds: string[]): Promise<Commodity[]> {
    let commodityList = await this.getCollection()
      .find({
        skus: {
          $elemMatch: {
            _id: { $in: skuIds },
          },
        },
      })
      .toArray()
    return commodityList.map((item) => CommodityMap.toDomain(item))
  }
}
