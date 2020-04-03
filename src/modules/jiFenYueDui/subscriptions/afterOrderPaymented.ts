import { IHandle } from '../../../shared/domain/events/IHandle'
import { DomainEvents } from '../../../shared/domain/events/DomainEvents'
import { OrderPaymented } from '../../orders/domain/events/orderPaymented'
import { CompleteTaskUseCase } from '../userCases/completeTask/completeTaskUseCase'

export class AfterOrderPaymented implements IHandle<OrderPaymented> {
  private completeTaskUseCase: CompleteTaskUseCase

  constructor(completeTaskUseCase: CompleteTaskUseCase) {
    this.setupSubscriptions()
    this.completeTaskUseCase = completeTaskUseCase
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
      let result = await this.completeTaskUseCase.execute({ userId: order.userId, type: "order" })
      if (result.isLeft()) {
        console.error(result.value)
      }
      console.log(`[OrderPaymented]: 支付订单，完成每日兑换任务`)
    } catch (err) {
      console.log(`[OrderPaymented]: 支付订单，完成每日兑换任务 ${err}`)
    }
  }
}
