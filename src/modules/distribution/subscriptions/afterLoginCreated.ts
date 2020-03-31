import { IHandle } from '../../../shared/domain/events/IHandle'
import { DomainEvents } from '../../../shared/domain/events/DomainEvents'
import { DailySignInUseCase } from '../userCases/signIns/dailySignIn/dailySignInUseCase'
import { UserLoggedIn } from '../../users/domain/events/userLoggedIn'
import { FlowUtils } from '../../../shared/utils/FlowUtils'

export class AfterLoginCreated implements IHandle<UserLoggedIn> {
  private dailySignInUseCase: DailySignInUseCase

  constructor(dailySignInUseCase: DailySignInUseCase) {
    this.setupSubscriptions()
    this.dailySignInUseCase = dailySignInUseCase
  }

  setupSubscriptions(): void {
    // Register to the domain event
    DomainEvents.register(
      {
        isNeedAwait: false,
        domainEvenntFn: this.onAfterLoginCreated.bind(this)
      },
      UserLoggedIn.name
    )
  }

  private async onAfterLoginCreated(event: UserLoggedIn): Promise<void> {
    const { user } = event

    try {
      let dailySignInUseCaseValue = await this.dailySignInUseCase.execute({
        userId: user.id.toString()
      })

      if (dailySignInUseCaseValue.isLeft()) {
        console.error(dailySignInUseCaseValue.value)
      }

      console.log(`[AfterLoginCreated]: 登录后签到`)
    } catch (err) {
      console.log(`[AfterLoginCreated]: 登录后签到 ${err}`)
    }
  }
}
