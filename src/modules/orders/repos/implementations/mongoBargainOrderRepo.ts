import { Db, MongoClient, Collection } from 'mongodb'

import { Global } from '../../../../shared/infra/database/mongodb'
import { DomainEvents } from '../../../../shared/domain/events/DomainEvents'
import { BargainOrderMap } from '../../mappers/bargainOrderMap'
import { BargainOrder } from '../../domain/bargainOrder'
import { IBargainOrderDbModel } from '../../dbModels/bargainOrderDbModel'
import { IBargainOrderRepo } from '../bargainOrderRepo'

export class MongoBargainOrderRepo implements IBargainOrderRepo {
  constructor() { }

  private createCollection(): Collection<IBargainOrderDbModel> {
    return Global.instance.mongoDb.collection<IBargainOrderDbModel>('bargainOrder')
  }

  public async getById(_id: string): Promise<BargainOrder> {
    let bargainOrder = await this.createCollection().findOne({ _id })
    return BargainOrderMap.toDomain(bargainOrder)
  }

  public async save(bargainOrder: BargainOrder): Promise<void> {
    const raw = await BargainOrderMap.toPersistence(bargainOrder)
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

          userName: raw.userName,
          provinceName: raw.provinceName,
          cityName: raw.cityName,
          countyName: raw.countyName,
          detailAddressInfo: raw.detailAddressInfo,
          nationalCode: raw.nationalCode,
          telNumber: raw.telNumber,
        }
      },
      { upsert: true }
    )

    await DomainEvents.dispatchEventsForAggregate(bargainOrder)
  }

  public async exist(_id: string): Promise<boolean> {
    let bargainOrder = await this.createCollection().findOne({ _id })
    return !!bargainOrder === true
  }

  public async  filter(): Promise<BargainOrder[]> {
    const list = await this.createCollection().find().toArray()
    return list.map(item => BargainOrderMap.toDomain(item))
  }

}
