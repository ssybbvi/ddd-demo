import { IHandle } from '../../../shared/domain/events/IHandle'
import { DomainEvents } from '../../../shared/domain/events/DomainEvents'
import { OrderPaymented } from '../../orders/domain/events/orderPaymented'
import { CreateFundDto } from '../userCases/funds/createFund/createFundDto'
import { CreateFundUseCase } from '../userCases/funds/createFund/createFundUseCase'

export class AfterOrderPaymented implements IHandle<OrderPaymented> {
    private createFundUseCase: CreateFundUseCase

    constructor(createFundUseCase: CreateFundUseCase ) {
      this.setupSubscriptions()
      this.createFundUseCase = createFundUseCase
    }
  
    setupSubscriptions(): void {
      // Register to the domain event
      DomainEvents.register(this.onAfterOrderPaymented.bind(this), OrderPaymented.name)
    }
  
    private async onAfterOrderPaymented(event: OrderPaymented): Promise<void> {
      const { order } = event
  
      try {

        const dto:CreateFundDto={
            amount: order.price,
            incomeMemberId: "0",
            paymentMemberId: order.memberId,
            type: "paymentOrder",
            relationId: order.id.toString()
        }

        let result=await this.createFundUseCase.execute(dto)
        if (result.isLeft()) {
          console.error(result.value)
        }
        console.log(`[OrderPaymented]: Successfully executed CreateMember use case OrderPaymented`)
      } catch (err) {
        console.log(`[OrderPaymented]: Failed to execute CreateMember use case OrderPaymented.`)
      }
    }
  }
  