import { IHandle } from '../../../shared/domain/events/IHandle'
import { DomainEvents } from '../../../shared/domain/events/DomainEvents'
import { UseCouponUserUseCase } from '../useCases/couponUser/useCouponUser/useCouponUserUseCase'
import { OrderCreated } from '../../orders/domain/events/orderCreated'

export class AfterOrderCreated implements IHandle<OrderCreated> {
  private useCouponUserUseCase: UseCouponUserUseCase

  constructor(useCouponUserUseCase: UseCouponUserUseCase) {
    this.setupSubscriptions()
    this.useCouponUserUseCase = useCouponUserUseCase
  }

  setupSubscriptions(): void {
    // Register to the domain event
    DomainEvents.register(
      {
        isNeedAwait: false,
        domainEvenntFn: this.onAfterOrderCreated.bind(this),
      },
      OrderCreated.name
    )
  }

  private async onAfterOrderCreated(event: OrderCreated): Promise<void> {
    const { order } = event

    try {
      if (!order.couponId) {
        console.log(`[OrderCreated]: 没有使用优惠券`)
        return
      }
      let result = await this.useCouponUserUseCase.execute({ userId: order.userId, couponId: order.couponId })
      if (result.isLeft()) {
        console.error(result.value)
      }
      console.log(`[OrderCreated]: 优惠券修改成已使用`)
    } catch (err) {
      console.error(`[OrderCreated]: 优惠券修改成已使用 ${err}`)
    }
  }
}
