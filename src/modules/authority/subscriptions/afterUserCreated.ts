import { UserCreated } from '../../users/domain/events/userCreated'
import { IHandle } from '../../../shared/domain/events/IHandle'
import { DomainEvents } from '../../../shared/domain/events/DomainEvents'
import { CreateAuthorityUserUseCase } from '../useCases/authorityUsers/createAuthorityUser/createAuthorityUserUseCase'

export class AfterUserCreated implements IHandle<UserCreated> {
  private createAuthorityUser: CreateAuthorityUserUseCase

  constructor(createAuthorityUser: CreateAuthorityUserUseCase) {
    this.setupSubscriptions()
    this.createAuthorityUser = createAuthorityUser
  }
  isNeedAwait: boolean

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
      await this.createAuthorityUser.execute({ name: '', roleIds: [] })
      console.log(`[AfterUserCreated]: Successfully executed CreateAuthorityUser use case AfterUserCreated`)
    } catch (err) {
      console.log(`[AfterUserCreated]: Failed to execute CreateAuthorityUser use case AfterUserCreated.`)
    }
  }
}
