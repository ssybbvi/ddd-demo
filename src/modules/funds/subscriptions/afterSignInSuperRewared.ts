import { IHandle } from '../../../shared/domain/events/IHandle'
import { DomainEvents } from '../../../shared/domain/events/DomainEvents'
import { FundService } from '../domain/services/fundService'
import { SignInSuperRewared } from '../../distribution/domain/events/signInSuperRewared'

export class AfterSignInSuperRewared implements IHandle<SignInSuperRewared> {
  private fundService: FundService

  constructor(fundService: FundService) {
    this.setupSubscriptions()
    this.fundService = fundService
  }

  setupSubscriptions(): void {
    // Register to the domain event
    DomainEvents.register(this.onUserCreated.bind(this), SignInSuperRewared.name)
  }

  private async onUserCreated(event: SignInSuperRewared): Promise<void> {
    const { signIn } = event
    try {
      let result = await this.fundService.signInRewared(signIn, 'signInSuperReward')
      if (result.isLeft()) {
        console.error(result.value)
      }
      console.log(`[AfterSignInSuperRewared]: Successfully executed CreateMember use case AfterSignInSuperRewared`)
    } catch (err) {
      console.log(`[AfterSignInSuperRewared]: Failed to execute CreateMember use case AfterSignInSuperRewared.`)
    }
  }
}
