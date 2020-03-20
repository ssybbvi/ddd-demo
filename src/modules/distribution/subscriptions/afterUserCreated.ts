import { User } from '../../users/domain/user'
import { UserCreated } from '../../users/domain/events/userCreated'
import { IHandle } from '../../../shared/domain/events/IHandle'
import { CreateMember } from '../userCases/members/createMember/createMember'
import { DomainEvents } from '../../../shared/domain/events/DomainEvents'

export class AfterUserCreated implements IHandle<UserCreated> {
  private createMember: CreateMember

  constructor(createMember: CreateMember) {
    this.setupSubscriptions()
    this.createMember = createMember
  }

  setupSubscriptions(): void {
    // Register to the domain event
    DomainEvents.register(this.onUserCreated.bind(this), UserCreated.name)
  }

  private async onUserCreated(event: UserCreated): Promise<void> {
    const { user, extra } = event

    try {
      const result=  await this.createMember.execute({
        userId: user.userId.id.toString(),
        inviteToken: extra ? extra.inviteToken : null
      })

      if(result.isLeft()){
        console.error(result.value)
        return 
      }

      console.log(`[AfterUserCreated]: Successfully executed CreateMember use case AfterUserCreated`)
    } catch (err) {
      console.log(`[AfterUserCreated]: Failed to execute CreateMember use case AfterUserCreated.`)
    }
  }
}
