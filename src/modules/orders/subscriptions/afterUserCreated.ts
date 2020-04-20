import { UserCreated } from '../../users/domain/events/userCreated'
import { IHandle } from '../../../shared/domain/events/IHandle'
import { DomainEvents } from '../../../shared/domain/events/DomainEvents'
import { CreateOrderUserUseCase } from '../useCases/orderUser/createOrderUser/createOrderUserUseCase'

export class AfterUserCreated implements IHandle<UserCreated> {
  private createOrderUserUseCase: CreateOrderUserUseCase

  constructor(createOrderUserUseCase: CreateOrderUserUseCase) {
    this.setupSubscriptions()
    this.createOrderUserUseCase = createOrderUserUseCase
  }

  setupSubscriptions(): void {
    // Register to the domain event
    DomainEvents.register(
      {
        isNeedAwait: false,
        domainEvenntFn: this.onUserCreated.bind(this)
      },
      UserCreated.name
    )
  }

  private async onUserCreated(event: UserCreated): Promise<void> {
    const { user } = event

    try {
      let createOrderUserUseCaseResult = await this.createOrderUserUseCase.execute({
        userId: user.userId.id.toString()
      })
      if (createOrderUserUseCaseResult.isLeft()) {
        console.error(createOrderUserUseCaseResult.value.getValue())
      }

      console.log(`[AfterUserCreated]: 新用户，创建订单用户状态`)
    } catch (err) {
      console.log(`[AfterUserCreated]:  新用户，创建订单用户状态 ${err}`)
    }
  }
}
