import { IHandle } from '../../../shared/domain/events/IHandle'
import { DomainEvents } from '../../../shared/domain/events/DomainEvents'
import { OrderPaymented } from '../../orders/domain/events/orderPaymented'
import { SaleCommodityUseCase } from '../userCases/saleCommodity/saleCommodityUseCase'

export class AfterOrderPaymented implements IHandle<OrderPaymented> {
    private saleCommodityUseCase: SaleCommodityUseCase

    constructor(saleCommodityUseCase: SaleCommodityUseCase ) {
      this.setupSubscriptions()
      this.saleCommodityUseCase = saleCommodityUseCase
    }
  
    setupSubscriptions(): void {
      // Register to the domain event
      DomainEvents.register(this.onAfterOrderPaymented.bind(this), OrderPaymented.name)
    }
  
    private async onAfterOrderPaymented(event: OrderPaymented): Promise<void> {
      const { order } = event
  
      try {

        const orderItemList= order.orderItems
        for(const item of orderItemList){
          const useCaseResult=await this.saleCommodityUseCase.execute({commodityId:item.commodityId})
          if(useCaseResult.isLeft()){
            console.error(useCaseResult.value.error)
          }
        }
        console.log(`[OrderPaymented]: Successfully executed SaleCommodityUseCase use case OrderPaymented`)
      } catch (err) {
        console.log(`[OrderPaymented]: Failed to execute SaleCommodityUseCase use case OrderPaymented.`)
      }
    }
  }
  