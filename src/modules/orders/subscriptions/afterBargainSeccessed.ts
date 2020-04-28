import { IHandle } from '../../../shared/domain/events/IHandle'
import { DomainEvents } from '../../../shared/domain/events/DomainEvents'
import { CreateOrderUseCase } from '../useCases/order/createOrder/createOrderUseCase'
import { BargainSeccessed } from '../domain/events/bargainSeccessed'
import { Bargain } from '../domain/bargain'

export class AfterBargainSeccessed implements IHandle<BargainSeccessed> {
  private createOrderUseCase: CreateOrderUseCase

  constructor(createOrderUseCase: CreateOrderUseCase) {
    this.setupSubscriptions()
    this.createOrderUseCase = createOrderUseCase
  }

  setupSubscriptions(): void {
    // Register to the domain event
    DomainEvents.register(
      {
        isNeedAwait: false,
        domainEvenntFn: this.onBargainSeccessed.bind(this)
      },
      BargainSeccessed.name
    )
  }

  private async onBargainSeccessed(event: BargainSeccessed): Promise<void> {
    const { bargain } = event
    this.createOrder(bargain)
    this.createDeliveryInfo(bargain)
  }

  private async createOrder(bargain: Bargain) {
    try {
      // const createOrderUseCaseResult = await this.createOrderUseCase.execute({
      //   userId: bargain.userId,

      //   paymentType: 'bargain',
      //   deliveryInfoType: 'express',

      //   commodityItems: [{ commodityId: "" }]
      // })
      // if (createOrderUseCaseResult.isLeft()) {
      //   console.error(createOrderUseCaseResult.value.getValue())
      // }

      console.log(`[AfterBargainSeccessed]: 砍价成功，创建订单`)
    } catch (err) {
      console.log(`[AfterBargainSeccessed]: 砍价成功，创建订单 ${err}`)
    }
  }

  private async createDeliveryInfo(bargain: Bargain) {
    try {
      // const orderId = bargain.id.toString()
      // const createDeliveryInfoUseCaseResult = await this.createDeliveryInfoUseCase.execute({ orderId, address: bargain.address })
      // if (createDeliveryInfoUseCaseResult.isLeft()) {
      //   console.error(createDeliveryInfoUseCaseResult.value.getValue())
      // }
      console.log(`[AfterBargainSeccessed]: 砍价成功，创建收货地址`)
    } catch (err) {
      console.log(`[AfterBargainSeccessed]: 砍价成功，创建收货地址 ${err}`)
    }
  }
}
