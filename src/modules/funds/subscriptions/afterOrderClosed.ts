import { IHandle } from '../../../shared/domain/events/IHandle'
import { DomainEvents } from '../../../shared/domain/events/DomainEvents'
import { FundStatusChangeDto } from '../userCases/funds/fundStatusChange/fundStatusChangeDto'
import { FundStatusChangeUseCase } from '../userCases/funds/fundStatusChange/fundStatusChangeUseCase'
import { OrderClosed } from '../../orders/domain/events/orderClosed'

export class AfterOrderClosed implements IHandle<OrderClosed> {
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
        domainEvenntFn: this.onAfterOrderClosed.bind(this)
      },
      OrderClosed.name
    )
  }

  private async onAfterOrderClosed(event: OrderClosed): Promise<void> {
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
      console.log(`[OrderClosed]: 关闭订单，作废支出资金流水`)
    } catch (err) {
      console.log(`[OrderClosed]: 关闭订单，作废支出资金流水 ${err}`)
    }
  }
}
