import { UserCreated } from '../../users/domain/events/userCreated'
import { IHandle } from '../../../shared/domain/events/IHandle'
import { DomainEvents } from '../../../shared/domain/events/DomainEvents'
import { CompleteTaskUseCase } from '../userCases/completeTask/completeTaskUseCase'

export class AfterUserCreated implements IHandle<UserCreated> {
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
        domainEvenntFn: this.onUserCreated.bind(this)
      },
      UserCreated.name
    )
  }

  private async onUserCreated(event: UserCreated): Promise<void> {
    const { user } = event

    try {
      const completeTaskUseCaseUseCaseResult = await this.completeTaskUseCase.execute(
        { userId: user.id.toString(), type: "registered" })

      if (completeTaskUseCaseUseCaseResult.isLeft()) {
        console.error(completeTaskUseCaseUseCaseResult.value)
      }

      console.log(`[AfterUserCreated]: 新用户，完成注册任务`)
    } catch (err) {
      console.log(`[AfterUserCreated]:  新用户，完成注册任务 ${err}`)
    }
  }
}
