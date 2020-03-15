import { IHandle } from '../../../shared/domain/events/IHandle'
import { DomainEvents } from '../../../shared/domain/events/DomainEvents'
import { DailySignInUseCase } from '../userCases/signIns/dailySignIn/dailySignInUseCase'
import { UserLoggedIn } from '../../users/domain/events/userLoggedIn'

export class AfterLoginCreated implements IHandle<UserLoggedIn> {
  private dailySignInUseCase: DailySignInUseCase

  constructor(dailySignInUseCase: DailySignInUseCase) {
    this.setupSubscriptions()
    this.dailySignInUseCase = dailySignInUseCase
  }

  setupSubscriptions(): void {
    // Register to the domain event
    DomainEvents.register(this.onAfterLoginCreated.bind(this), UserLoggedIn.name)
  }

  private async onAfterLoginCreated(event: UserLoggedIn): Promise<void> {
    const { user } = event

    try {
      let dailySignInUseCaseValue = await this.dailySignInUseCase.execute({
        memberId: user.id.toString()
      })

      if (dailySignInUseCaseValue.isLeft()) {
        console.error(dailySignInUseCaseValue.value)
      }

      console.log(`[AfterLoginCreated]: Successfully executed CreateMember use case AfterLoginCreated`)
    } catch (err) {
      console.log(`[AfterLoginCreated]: Failed to execute CreateMember use case AfterLoginCreated.`)
    }
  }
}
