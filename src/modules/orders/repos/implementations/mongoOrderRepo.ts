import { DomainEvents } from '../../../../shared/domain/events/DomainEvents'
import { OrderDbModel } from '../../dbModels/orderDbModel'
import { IOrderRepo } from '../orderRepo'
import { OrderMap } from '../../mappers/orderMap'
import { Order } from '../../domain/order'
import { MongodbWithTenantCollection, MongodbWithTenant } from '../../../../shared/infra/database/mongodb/mongodbTenant'

export class MongoOrderRepo implements IOrderRepo {
  constructor() {}

  private getCollection(): MongodbWithTenantCollection<OrderDbModel> {
    return MongodbWithTenant.instance.Collection<OrderDbModel>('order')
  }

  public async getById(_id: string): Promise<Order> {
    let order = await this.getCollection().findOne({ _id })
    return OrderMap.toDomain(order)
  }

  public async save(order: Order): Promise<void> {
    const raw = await OrderMap.toPersistence(order)
    await this.getCollection().updateOne(
      { _id: raw._id },
      {
        $set: {
          userId: raw.userId,
          createAt: raw.createAt,
          totalAmount: raw.totalAmount,
          toPayAmount: raw.toPayAmount,
          remark: raw.remark,
          code: raw.code,
          couponId: raw.couponId,
          cancelInfo: raw.cancelInfo,
          paymentInfo: raw.paymentInfo,
          deliveryInfo: raw.deliveryInfo,
          addressInfo: raw.addressInfo,
          commodityItems: raw.commodityItems,
          strategys: raw.strategys,
        },
      },
      { upsert: true }
    )

    await DomainEvents.dispatchEventsForAggregate(order)
  }

  public async exist(_id: string): Promise<boolean> {
    let order = await this.getCollection().findOne({ _id })
    return !!order === true
  }

  public async filter(userId?: string): Promise<Order[]> {
    let query: any = {}

    if (!!userId === true) {
      query.userId = userId
    }
    let orderList = await this.getCollection().find(query).sort({ createAt: -1 }).toArray()
    return orderList.map((item) => OrderMap.toDomain(item))
  }

  public async cancelOrder(unpaidTime: number): Promise<void> {
    await this.getCollection().update(
      {
        createAt: {
          $lt: unpaidTime,
        },
        status: 'unpaid',
      },
      {
        $set: {
          status: 'cancel',
          cancelTime: Date.now(),
        },
      },
      {
        multi: true,
      }
    )
  }
}
