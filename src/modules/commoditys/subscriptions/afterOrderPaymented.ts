import { IHandle } from '../../../shared/domain/events/IHandle'
import { DomainEvents } from '../../../shared/domain/events/DomainEvents'
import { OrderPaymented } from '../../orders/domain/events/orderPaymented'
import { SaleCommodityUseCase } from '../userCases/commoditys/saleCommodity/saleCommodityUseCase'
import { CreatePurchaseHistoryUseCase } from '../userCases/purchaseHistory/createPurchaseHistory/createPurchaseHistoryUseCase'

export class AfterOrderPaymented implements IHandle<OrderPaymented> {
  private saleCommodityUseCase: SaleCommodityUseCase
  private createPurchaseHistoryUseCase: CreatePurchaseHistoryUseCase

  constructor(saleCommodityUseCase: SaleCommodityUseCase, createPurchaseHistoryUseCase: CreatePurchaseHistoryUseCase) {
    this.setupSubscriptions()
    this.saleCommodityUseCase = saleCommodityUseCase
    this.createPurchaseHistoryUseCase = createPurchaseHistoryUseCase
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
      const commodityItemList = order.commodityItems.getItems()
      for (const item of commodityItemList) {
        const commodityUseCaseResult = await this.saleCommodityUseCase.execute({ commodityId: item.commodityId })
        if (commodityUseCaseResult.isLeft()) {
          console.error(commodityUseCaseResult.value.error)
        }

        const createPurchaseHistoryUseCaseeResult = await this.createPurchaseHistoryUseCase.execute({
          commodityId: item.commodityId,
          userId: order.userId
        })
        if (createPurchaseHistoryUseCaseeResult.isLeft()) {
          console.error(createPurchaseHistoryUseCaseeResult.value)
        }
      }
      console.log(`[OrderPaymented]: 支付订单，增加商品销量`)
    } catch (err) {
      console.log(`[OrderPaymented]: 支付订单，增加商品销量. ${err}`)
    }
  }
}
