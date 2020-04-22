import { Db, MongoClient, Collection } from 'mongodb'

import { Global } from '../../../../shared/infra/database/mongodb'
import { DomainEvents } from '../../../../shared/domain/events/DomainEvents'
import { DeliveryOrderMap } from '../../mappers/deliveryOrderMap'
import { DeliveryOrder } from '../../domain/deliveryOrder'
import { IDeliveryOrderRepo } from '../deliveryOrderRepo'
import { IDeliveryOrderDbModel } from '../../dbModels/deliveryOrderDbModel'

export class MongoDeliveryOrderRepo implements IDeliveryOrderRepo {
  constructor() { }

  private createCollection(): Collection<IDeliveryOrderDbModel> {
    return Global.instance.mongoDb.collection<IDeliveryOrderDbModel>('deliveryOrder')
  }

  public async getById(_id: string): Promise<DeliveryOrder> {
    let deliveryOrder = await this.createCollection().findOne({ _id })
    return DeliveryOrderMap.toDomain(deliveryOrder)
  }

  public async save(deliveryOrder: DeliveryOrder): Promise<void> {
    const raw = await DeliveryOrderMap.toPersistence(deliveryOrder)
    await this.createCollection().updateOne(
      { _id: raw._id },
      {
        $set: {
          orderId: raw.orderId,
          beginAt: raw.beginAt,
          code: raw.code,
          finishAt: raw.finishAt,
          deliveryType: raw.deliveryType,

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
  }

  public async exist(_id: string): Promise<boolean> {
    let deliveryOrder = await this.createCollection().findOne({ _id })
    return !!deliveryOrder === true
  }

}
