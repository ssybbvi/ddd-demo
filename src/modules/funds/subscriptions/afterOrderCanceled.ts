import { IHandle } from '../../../shared/domain/events/IHandle'
import { DomainEvents } from '../../../shared/domain/events/DomainEvents'
import { FundStatusChangeDto } from '../userCases/funds/fundStatusChange/fundStatusChangeDto'
import { FundStatusChangeUseCase } from '../userCases/funds/fundStatusChange/fundStatusChangeUseCase'
import { OrderCanceled } from '../../orders/domain/events/orderCanceled'

export class AfterOrderCanceled implements IHandle<OrderCanceled> {
  private fundStatusChangeUseCase: FundStatusChangeUseCase

  constructor(fundStatusChangeUseCase: FundStatusChangeUseCase) {
    this.setupSubscriptions()
    this.fundStatusChangeUseCase = fundStatusChangeUseCase
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

      const dto: FundStatusChangeDto = {
        type: 'paymentOrder',
        relationId: order.id.toString(),
        status: 'invalid'
      }

      let result = await this.fundStatusChangeUseCase.execute(dto)
      if (result.isLeft()) {
        console.error(result.value)
      }
      console.log(`[OrderCanceled]: 关闭订单，作废支出资金流水`)
    } catch (err) {
      console.log(`[OrderCanceled]: 关闭订单，作废支出资金流水 ${err}`)
    }
  }
}
