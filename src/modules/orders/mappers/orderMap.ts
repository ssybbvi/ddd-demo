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
import { userIdToDto } from '../../users/infra/decorators/wxUserDtoDecorators'
import { AddressInfoMap } from './addressInfoMap'
import { StrategyMap } from '../../market/mappers/strategyMap'
import { Strategys } from '../../market/domain/strategys'

export class OrderMap implements IMapper<Order> {
  public static toDomain(raw: OrderDbModel): Order {
    if (!raw) {
      return null
    }

    const commodityItemList = raw.commodityItems.map((item) => CommodityItemMap.toDomain(item))
    const strategyList = raw.strategys.map((item) => StrategyMap.toDomain(item))

    const codeOrError = OrderCode.create({ code: raw.code })
    codeOrError.isFailure ? console.log(codeOrError) : ''

    const orderOrError = Order.create(
      {
        userId: raw.userId,
        createAt: raw.createAt,
        totalAmount: raw.totalAmount,
        toPayAmount: raw.toPayAmount,
        remark: raw.remark,
        code: codeOrError.getValue(),
        couponId: raw.couponId,

        cancelInfo: CancelInfoMap.toDomain(raw.cancelInfo),
        paymentInfo: PaymentInfoMap.toDomain(raw.paymentInfo),
        deliveryInfo: DeliveryInfoMap.toDomain(raw.deliveryInfo),
        addressInfo: AddressInfoMap.toDomain(raw.addressInfo),
        commodityItems: CommodityItems.create(commodityItemList),
        strategys: Strategys.create(strategyList),
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
    const commodityItems = order.commodityItems
      .getItems()
      .map<ICommodityItemDbModel>((item) => CommodityItemMap.toPersistence(item))

    const strategys = order.strategys.getItems().map((item) => StrategyMap.toPersistence(item))

    return {
      _id: order.id.toString(),
      userId: order.userId,
      createAt: order.createAt,
      totalAmount: order.totalAmount,
      toPayAmount: order.toPayAmount,
      remark: order.remark,
      code: order.code.code,
      couponId: order.couponId,

      cancelInfo: CancelInfoMap.toPersistence(order.cancelInfo),
      paymentInfo: PaymentInfoMap.toPersistence(order.paymentInfo),
      deliveryInfo: DeliveryInfoMap.toPersistence(order.deliveryInfo),
      addressInfo: AddressInfoMap.toPersistence(order.addressInfo),
      commodityItems: commodityItems,
      strategys: strategys,
    }
  }

  public static async toListDto(orderList: Order[]): Promise<OrderDto[]> {
    const list = []
    for (let item of orderList) {
      list.push(await this.toDTO(item))
    }
    return list
  }

  @userIdToDto()
  public static async toDTO(order: Order): Promise<OrderDto> {
    if (!order) {
      return null
    }
    const orderStatus = order.cancelInfo
      ? 'cancel'
      : order.deliveryInfo && order.deliveryInfo.finishAt
      ? 'received'
      : order.deliveryInfo && order.deliveryInfo.beginAt
      ? 'shipped'
      : order.paymentInfo
      ? 'shipping'
      : 'unpaid'

    const commodityItemDtoList = await CommodityItemMap.toListDto(order.commodityItems.getItems())
    const strategyList = StrategyMap.toListDto(order.strategys.getItems())

    return {
      _id: order.id.toString(),
      userId: order.userId,
      createAt: order.createAt,
      totalAmount: order.totalAmount,
      toPayAmount: order.toPayAmount,
      remark: order.remark,
      code: order.code.code,
      couponId: order.couponId,
      cancelInfo: CancelInfoMap.toDTO(order.cancelInfo),
      paymentInfo: PaymentInfoMap.toDTO(order.paymentInfo),
      deliveryInfo: DeliveryInfoMap.toDTO(order.deliveryInfo),
      addressInfo: AddressInfoMap.toDTO(order.addressInfo),
      commodityItems: commodityItemDtoList,
      status: orderStatus,
      strategys: strategyList,
    }
  }
}
