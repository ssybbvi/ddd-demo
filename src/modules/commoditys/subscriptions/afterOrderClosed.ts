import { IHandle } from '../../../shared/domain/events/IHandle'
import { DomainEvents } from '../../../shared/domain/events/DomainEvents'
import { WithdrawCommodityUseCase } from '../userCases/commoditys/withdrawCommodity/withdrawCommodityUseCase'
import { Order } from '../../orders/domain/order'
import { OrderClosed } from '../../orders/domain/events/orderClosed'

export class AfterOrderClosed implements IHandle<OrderClosed> {
  private withdrawCommodityUseCase: WithdrawCommodityUseCase

  constructor(withdrawCommodityUseCase: WithdrawCommodityUseCase) {
    this.setupSubscriptions()
    this.withdrawCommodityUseCase = withdrawCommodityUseCase
  }

  setupSubscriptions(): void {
    // Register to the domain event
    DomainEvents.register(
      {
        isNeedAwait: false,
        domainEvenntFn: this.onAfterOrderClosed.bind(this)
      },
      OrderClosed.name
    )
  }

  private async onAfterOrderClosed(event: OrderClosed): Promise<void> {
    const { order } = event
    this.withdrawSales(order)

  }

  private async  withdrawSales(order: Order) {
    try {
      const orderItemList = order.orderItems
      for (const item of orderItemList) {
        const useCaseResult = await this.withdrawCommodityUseCase.execute({ commodityId: item.commodityId })
        if (useCaseResult.isLeft()) {
          console.error(useCaseResult.value.error)
        }
      }
      console.log(`[OrderClosed]: 关闭订单恢复销量`)
    } catch (err) {
      console.log(`[OrderClosed]: 关闭订单恢复销量. ${err}`)
    }
  }

}
