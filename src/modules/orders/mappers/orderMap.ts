import { IMapper } from '../../../shared/infra/Mapper'
import { Order } from '../domain/order'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { OrderAddress } from '../domain/orderAddress'
import { OrderDto } from '../dtos/orderDto'
import { OrderItemDto } from '../dtos/orderItemDto'
import { OrderDbModel, OrderItemDbModel } from '../dbModels/orderDbModel'
import { OrderStatus } from '../domain/orderStatus'
import { OrderItem } from '../domain/orderItem'
import { CommodityType } from '../../commoditys/domain/commodityType'


export class OrderMap implements IMapper<Order> {
  public static toDTO(order: Order): OrderDto {

    const orderItemDtoList = order.orderItems.map(item => this.orderItemToDTO(item))

    return {
      _id: order.id.toString(),
      userId: order.userId,
      createAt: order.createAt,
      status: order.status,
      price: order.price,
      remark: order.remark,
      code: order.code,

      paymentTime: order.paymentTime,
      cancelTime: order.cancelTime,

      customerServiceCancelTime: order.customerServiceCancelTime,
      customerServiceRemark: order.customerServiceRemark,


      finishTime: order.finishTime,

      closeTime: order.closeTime,

      items: orderItemDtoList
    }
  }

  private static orderItemToDTO(ordreItem: OrderItem): OrderItemDto {
    return {
      _id: ordreItem.id.toString(),
      name: ordreItem.name,
      price: ordreItem.price,
      image: ordreItem.image,
      commodityId: ordreItem.commodityId
    }
  }

  public static toDomain(raw: OrderDbModel): Order {
    if (raw === null || raw === undefined) {
      return null
    }

    const orderItemList = raw.items.map(item => this.orderItemDbModelToDomain(item))

    const orderOrError = Order.create(
      {
        userId: raw.userId,
        createAt: raw.createAt,
        status: raw.status as OrderStatus,
        price: raw.price,
        remark: raw.remark,
        code: raw.code,


        paymentTime: raw.paymentTime,
        cancelTime: raw.cancelTime,

        customerServiceCancelTime: raw.customerServiceCancelTime,
        customerServiceRemark: raw.customerServiceRemark,


        finishTime: raw.finishTime,

        closeTime: raw.closeTime,

        items: orderItemList
      },
      new UniqueEntityID(raw._id)
    )
    orderOrError.isFailure ? console.log(orderOrError.error) : ''
    return orderOrError.isSuccess ? orderOrError.getValue() : null
  }

  private static orderItemDbModelToDomain(orderItemDbModel: OrderItemDbModel): OrderItem {
    let orderItemOrErrors = OrderItem.create({
      name: orderItemDbModel.name,
      price: orderItemDbModel.price,
      image: orderItemDbModel.image,
      commodityId: orderItemDbModel.commodityId,
      commodityType: orderItemDbModel.commodityType as CommodityType
    }, new UniqueEntityID(orderItemDbModel._id))

    orderItemOrErrors.isSuccess ? "" : console.error(orderItemOrErrors.errorValue())

    return orderItemOrErrors.getValue()
  }


  public static async toPersistence(order: Order): Promise<OrderDbModel> {
    let orderItemDbModelList: OrderItemDbModel[] = order.orderItems.map(item => this.toOrderItemPersistence(item))

    return {
      _id: order.id.toString(),
      userId: order.userId,
      createAt: order.createAt,
      status: order.status,
      price: order.price,
      remark: order.remark,
      code: order.code,

      paymentTime: order.paymentTime,
      cancelTime: order.cancelTime,

      customerServiceCancelTime: order.customerServiceCancelTime,
      customerServiceRemark: order.customerServiceRemark,

      finishTime: order.finishTime,

      closeTime: order.closeTime,

      items: orderItemDbModelList
    }
  }

  private static toOrderItemPersistence(orderItem: OrderItem): OrderItemDbModel {
    return {
      _id: orderItem.id.toString(),
      name: orderItem.name,
      price: orderItem.price,
      image: orderItem.image,
      commodityId: orderItem.commodityId,
      commodityType: orderItem.commodityType.toString(),
    }
  }
}
