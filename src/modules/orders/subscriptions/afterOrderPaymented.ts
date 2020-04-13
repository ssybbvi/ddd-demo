import { IHandle } from '../../../shared/domain/events/IHandle'
import { DomainEvents } from '../../../shared/domain/events/DomainEvents'
import { OrderPaymented } from '../../orders/domain/events/orderPaymented'
import { CreateOrderUserUseCase } from '../userCases/orderUser/createOrderUser/createOrderUserUseCase'
import { CreateOrderUserDto } from '../userCases/orderUser/createOrderUser/createOrderUserDto'
import { IOrderRepo } from '../repos/orderRepo'
import { CancelOrderUseCase } from '../userCases/order/cancelOrder/cancelOrderUseCase'
import { BuyOnceCommodityUseCase } from '../userCases/orderUser/buyOnceCommodity/buyOnceCommodityUseCase'

export class AfterOrderPaymented implements IHandle<OrderPaymented> {
  private buyOnceCommodityUseCase: BuyOnceCommodityUseCase
  private orderRepo: IOrderRepo
  private cancelOrderUseCase: CancelOrderUseCase

  constructor(
    buyOnceCommodityUseCase: BuyOnceCommodityUseCase,
    orderRepo: IOrderRepo,
    cancelOrderUseCase: CancelOrderUseCase) {
    this.setupSubscriptions()
    this.buyOnceCommodityUseCase = buyOnceCommodityUseCase
    this.orderRepo = orderRepo
    this.cancelOrderUseCase = cancelOrderUseCase
  }

  setupSubscriptions(): void {
    // Register to the domain event
    DomainEvents.register(
      {
        isNeedAwait: false,
        domainEvenntFn: this.onAfterOrderPaymented.bind(this)
      },
      OrderPaymented.name
    )
  }

  private async onAfterOrderPaymented(event: OrderPaymented): Promise<void> {
    const { order } = event

    try {
      const isOrderItemHasBuyOnceeCommodity = order.orderItems.some(item => item.commodityType == 'buyOnce')
      if (isOrderItemHasBuyOnceeCommodity) {
        this.buyOnceCommodity(order.userId)
        this.cancelOrderByBuyOnceCommotidy(order.userId)
      }
      console.log(`[OrderPaymented]: 记录用户支付订单中商品的类型`)
    } catch (err) {
      console.log(`[OrderPaymented]: 记录用户支付订单中商品的类型 ${err}`)
    }
  }

  private async buyOnceCommodity(userId: string) {
    let result = await this.buyOnceCommodityUseCase.execute({
      userId: userId,
    })
    if (result.isLeft()) {
      console.error(result.value)
    }
    console.log(`[OrderPaymented]: 如果订单中的商品是新手特享，需要标记`)
  }

  private async cancelOrderByBuyOnceCommotidy(userId: string) {
    const orderList = await this.orderRepo.filter('unpaid', userId)

    for (let item of orderList) {
      const isHasBuyOnceCommodity = item.orderItems.some(item => item.commodityType == 'buyOnce')
      console.log("isHasBuyOnceCommodity:", isHasBuyOnceCommodity)
      if (isHasBuyOnceCommodity) {
        console.log("cancelOrder.orderId", item.id.toString())
        this.cancelOrderUseCase.execute({ orderId: item.id.toString() })
      }
    }
    console.log(`[OrderPaymented]: 如果支付的订单中含有新手特享商品，其他未支付的订单中也含有新手特享的商品就要取消`)
  }

}
