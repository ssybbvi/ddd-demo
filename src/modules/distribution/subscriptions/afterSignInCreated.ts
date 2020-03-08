import { IHandle } from '../../../shared/domain/events/IHandle'
import { DomainEvents } from '../../../shared/domain/events/DomainEvents'
import { SignInCreated } from '../domain/events/signInCreated'

export class AfterSignInCreated implements IHandle<SignInCreated> {
  private signInCreated: SignInCreated

  constructor(signInCreated: SignInCreated) {
    this.setupSubscriptions()
    this.signInCreated = signInCreated
  }

  setupSubscriptions(): void {
    // Register to the domain event
    DomainEvents.register(this.onUserCreated.bind(this), SignInCreated.name)
  }

  private async onUserCreated(event: SignInCreated): Promise<void> {
    const { signIn } = event

    try {
      // await this.createMember.execute({
      //   userId: user.userId.id.toString(),
      //   inviteToken: extra ? extra.inviteToken : null
      // })
      console.log(`[AfterUserCreated]: Successfully executed CreateMember use case AfterUserCreated`)
    } catch (err) {
      console.log(`[AfterUserCreated]: Failed to execute CreateMember use case AfterUserCreated.`)
    }
  }
}
