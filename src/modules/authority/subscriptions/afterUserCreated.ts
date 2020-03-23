import { UserCreated } from '../../users/domain/events/userCreated'
import { IHandle } from '../../../shared/domain/events/IHandle'
import { CreateAuthorityUser } from '../useCases/authorityUsers/createAuthorityUser/CreateAuthorityUser'
import { DomainEvents } from '../../../shared/domain/events/DomainEvents'

export class AfterUserCreated implements IHandle<UserCreated> {
  private createAuthorityUser: CreateAuthorityUser

  constructor(createAuthorityUser: CreateAuthorityUser) {
    this.setupSubscriptions()
    this.createAuthorityUser = createAuthorityUser
  }

  setupSubscriptions(): void {
    // Register to the domain event
    DomainEvents.register(this.onUserCreated.bind(this), UserCreated.name)
  }

  private async onUserCreated(event: UserCreated): Promise<void> {
    const { user } = event

    try {
      await this.createAuthorityUser.execute({  name: "" , roleIds:[]  })
      console.log(`[AfterUserCreated]: Successfully executed CreateAuthorityUser use case AfterUserCreated`)
    } catch (err) {
      console.log(`[AfterUserCreated]: Failed to execute CreateAuthorityUser use case AfterUserCreated.`)
    }
  }
}
