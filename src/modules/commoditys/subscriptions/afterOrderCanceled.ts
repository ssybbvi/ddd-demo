import { IHandle } from '../../../shared/domain/events/IHandle'
import { DomainEvents } from '../../../shared/domain/events/DomainEvents'
import { OrderCanceled } from '../../orders/domain/events/orderCanceled'
import { WithdrawCommodityUseCase } from '../userCases/commoditys/withdrawCommodity/withdrawCommodityUseCase'

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

    try {
      const orderItemList = order.orderItems
      for (const item of orderItemList) {
        const useCaseResult = await this.withdrawCommodityUseCase.execute({ commodityId: item.commodityId })
        if (useCaseResult.isLeft()) {
          console.error(useCaseResult.value.error)
        }
      }
      console.log(`[OrderCanceled]: 取消订单恢复xxx`)
    } catch (err) {
      console.log(`[OrderCanceled]: 取消订单恢复xxx. ${err}`)
    }
  }
}
