import { IHandle } from '../../../shared/domain/events/IHandle'
import { DomainEvents } from '../../../shared/domain/events/DomainEvents'
import { WithdrawCommodityUseCase } from '../userCases/commoditys/withdrawCommodity/withdrawCommodityUseCase'
import { Order } from '../../orders/domain/order'
import { OrderCanceled } from '../../orders/domain/events/orderCanceled'

export class AfterOrderCanceled implements IHandle<OrderCanceled> {
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
        domainEvenntFn: this.onAfterOrderCanceled.bind(this)
      },
      OrderCanceled.name
    )
  }

  private async onAfterOrderCanceled(event: OrderCanceled): Promise<void> {
    const { order } = event
    this.withdrawSales(order)

  }

  private async  withdrawSales(order: Order) {
    try {
      const commodityItemList = order.commodityItems
      for (const item of commodityItemList.getItems()) {
        const useCaseResult = await this.withdrawCommodityUseCase.execute({ commodityId: item.commodityId })
        if (useCaseResult.isLeft()) {
          console.error(useCaseResult.value.error)
        }
      }
      console.log(`[OrderCanceled]: 关闭订单恢复销量`)
    } catch (err) {
      console.log(`[OrderCanceled]: 关闭订单恢复销量. ${err}`)
    }
  }

}
