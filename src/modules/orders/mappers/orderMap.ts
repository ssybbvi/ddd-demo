import { IMapper } from '../../../shared/infra/Mapper'
import { Order } from '../domain/order'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { OrderDto } from '../dtos/orderDto'
import { OrderDbModel } from '../dbModels/orderDbModel'
import { OrderCode } from '../domain/orderCode'
import { DeliveryInfoMap } from './deliveryInfoMap'
import { CommodityItems } from '../domain/commodityItems'
import { CommodityItemMap } from './commodityItemMap'
import { PaymentInfoMap } from './paymentInfoMap'
import { CancelInfoMap } from './cancelInfoMap'
import { ICommodityItemDbModel } from '../dbModels/commodityItemDbModel'


export class OrderMap implements IMapper<Order> {
  public static toDomain(raw: OrderDbModel): Order {
    if (!raw) {
      return null
    }

    const commodityItemList = raw.commodityItems.map(item => CommodityItemMap.toDomain(item))

    const codeOrError = OrderCode.create({ code: raw.code })
    codeOrError.isFailure ? console.log(codeOrError) : ''


    const orderOrError = Order.create(
      {
        userId: raw.userId,
        createAt: raw.createAt,
        totalAmount: raw.totalAmount,
        remark: raw.remark,
        code: codeOrError.getValue(),

        cancelInfo: CancelInfoMap.toDomain(raw.cancelInfo),
        paymentInfo: PaymentInfoMap.toDomain(raw.paymentInfo),
        deliveryInfo: DeliveryInfoMap.toDomain(raw.deliveryInfo),

        commodityItems: CommodityItems.create(commodityItemList)
      },
      new UniqueEntityID(raw._id)
    )
    orderOrError.isFailure ? console.log(orderOrError.error) : ''
    return orderOrError.isSuccess ? orderOrError.getValue() : null
  }


  public static async toPersistence(order: Order): Promise<OrderDbModel> {
    if (!order) {
      return null
    }
    const commodityItems = order.commodityItems.getItems().map<ICommodityItemDbModel>(item => CommodityItemMap.toPersistence(item))

    return {
      _id: order.id.toString(),
      userId: order.userId,
      createAt: order.createAt,
      totalAmount: order.totalAmount,
      remark: order.remark,
      code: order.code.code,

      cancelInfo: CancelInfoMap.toPersistence(order.cancelInfo),
      paymentInfo: PaymentInfoMap.toPersistence(order.paymentInfo),
      deliveryInfo: DeliveryInfoMap.toPersistence(order.deliveryInfo),

      commodityItems: commodityItems
    }
  }


  public static toDTO(order: Order): OrderDto {
    if (!order) {
      return null
    }
    const commodityItems = order.commodityItems.getItems().map(item => CommodityItemMap.toDTO(item))
    return {
      _id: order.id.toString(),
      userId: order.userId,
      createAt: order.createAt,
      totalAmount: order.totalAmount,
      remark: order.remark,
      code: order.code.code,

      cancelInfo: CancelInfoMap.toDTO(order.cancelInfo),
      paymentInfo: PaymentInfoMap.toDTO(order.paymentInfo),
      deliveryInfo: DeliveryInfoMap.toDTO(order.deliveryInfo),

      commodityItems: commodityItems
    }
  }

}
