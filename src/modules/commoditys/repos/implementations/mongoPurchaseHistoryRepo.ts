import { Db, MongoClient, Collection } from 'mongodb'

import { Global } from '../../../../shared/infra/database/mongodb'
import { DomainEvents } from '../../../../shared/domain/events/DomainEvents'
import { IPurchaseHistoryRepo } from '../iPurchaseHistoryRepo'
import { IPurchaseHistoryDbModel } from '../../dbModels/purchaseHistoryDbModel'
import { PurchaseHistory } from '../../domain/purchaseHistory'
import { PurchaseHistoryMap } from '../../mappers/purchaseHistoryMap'
import { MongodbWithTenantCollection, MongodbWithTenant } from '../../../../shared/infra/database/mongodb/mongodbTenant'

export class MongoPurchaseHistoryRepo implements IPurchaseHistoryRepo {
  constructor() { }

  private getCollection(): MongodbWithTenantCollection<IPurchaseHistoryDbModel> {
    return MongodbWithTenant.instance.Collection<IPurchaseHistoryDbModel>('purchaseHistory')
  }

  public async getById(_id: string): Promise<PurchaseHistory> {
    let purchaseHistory = await this.getCollection().findOne({ _id })
    return PurchaseHistoryMap.toDomain(purchaseHistory)
  }

  public async save(purchaseHistory: PurchaseHistory): Promise<void> {
    const raw = await PurchaseHistoryMap.toPersistence(purchaseHistory)
    await this.getCollection().updateOne(
      { _id: raw._id },
      {
        $set: {
          commodityId: raw.commodityId,
          userId: raw.userId,
          craeteAt: raw.craeteAt,
        }
      },
      { upsert: true }
    )

    await DomainEvents.dispatchEventsForAggregate(purchaseHistory)
  }

  public async exist(_id: string): Promise<boolean> {
    let purchaseHistory = await this.getCollection().findOne({ _id })
    return !!purchaseHistory === true
  }

  public async filter(commodityId: string): Promise<PurchaseHistory[]> {
    let purchaseHistoryList = await this.getCollection()
      .find({ commodityId })
      .toArray()
    return purchaseHistoryList.map(item => PurchaseHistoryMap.toDomain(item))
  }
}
