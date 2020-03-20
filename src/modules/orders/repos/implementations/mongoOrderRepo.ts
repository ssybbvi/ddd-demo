import { Db, MongoClient, Collection } from 'mongodb'

import { Global } from '../../../../shared/infra/database/mongodb'
import { DomainEvents } from '../../../../shared/domain/events/DomainEvents'
import { OrderDbModel } from '../../dbModels/orderDbModel'
import { IOrderRepo } from '../orderRepo'
import { OrderMap } from '../../mappers/orderMap'
import { Order } from '../../domain/order'
import { OrderStatus } from '../../domain/orderStatus'

export class MongoOrderRepo implements IOrderRepo {
  constructor() {}

  private createCollection(): Collection<OrderDbModel> {
    return Global.instance.mongoDb.collection<OrderDbModel>('order')
  }

  public async getById(_id: string): Promise<Order> {
    let order = await this.createCollection().findOne({ _id })
    return OrderMap.toDomain(order)
  }

  public async save(order: Order): Promise<void> {
    const raw = await OrderMap.toPersistence(order)
    await this.createCollection().updateOne(
      { _id: raw._id },
      {
        $set: {
          memberId:raw.memberId,
          createAt:raw.createAt,
          status:raw.status,
          price:raw.price,
          remark:raw.remark,
          code:raw.code,
      
          userName:raw.userName,
          provinceName : raw.provinceName,
          cityName : raw.cityName,
          countyName : raw.countyName,
          detailAddressInfo : raw.detailAddressInfo,
          nationalCode : raw.nationalCode,
          telNumber :raw.telNumber,
      
          paymentTime:raw.paymentTime,
          cancelTime:raw.cancelTime,
      
          customerServiceCancelTime:raw.customerServiceCancelTime,
          customerServiceRemark:raw.customerServiceRemark,
      
          shippingTime:raw.shippingTime,
          shippingNumber:raw.shippingNumber,
          shippingType:raw.shippingType,
      
          finishTime:raw.finishTime,
      
          items:raw.items
        }
      },
      { upsert: true }
    )

    DomainEvents.dispatchEventsForAggregate(order)
  }

  public async exist(_id: string): Promise<boolean> {
    let order = await this.createCollection().findOne({ _id })
    return !!order === true
  }

  public async filter(orderStatus:OrderStatus|'',memberId:string): Promise<Order[]> {
    let query:any={  }
    if(!!orderStatus===true){
      query.orderStatus=orderStatus
    }

    if(!!memberId===true){
      query.memberId=memberId
    }

    let orderList = await this.createCollection()
      .find(query)
      .toArray()
    return orderList.map(item => OrderMap.toDomain(item))
  }

  public async cancelOrder(unpaidTime:number):Promise<void>{
    await this.createCollection().update({
      createAt:{
          $lt:unpaidTime
      },
      status:"unpaid"
  },{
    $set:{
      status:"cancel",
      cancelTime:Date.now()
    }
  },{
    multi:true
  })
  }

 
}
