import { User } from '../../users/domain/user'
import { UserCreated } from '../../users/domain/events/userCreated'
import { IHandle } from '../../../shared/domain/events/IHandle'
import { CreateMember } from '../userCases/members/createMember/createMember'
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

      console.log(`[AfterUserCreated]: Successfully executed CreateMember use case AfterUserCreated`)
    } catch (err) {
      console.log(`[AfterUserCreated]: Failed to execute CreateMember use case AfterUserCreated.`)
    }
  }
}
