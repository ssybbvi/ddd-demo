import { UserCreated } from '../../users/domain/events/userCreated'
import { IHandle } from '../../../shared/domain/events/IHandle'
import { DomainEvents } from '../../../shared/domain/events/DomainEvents'
import { UpdateFundAccountUseCase } from '../userCases/fundAccounts/updateFundAccount/updateFundAccountUseCase'

export class AfterUserCreated implements IHandle<UserCreated> {
  private updateFundAccountUseCase: UpdateFundAccountUseCase

  constructor(updateFundAccountUseCase: UpdateFundAccountUseCase) {
    this.setupSubscriptions()
    this.updateFundAccountUseCase = updateFundAccountUseCase
  }

  setupSubscriptions(): void {
    // Register to the domain event
    DomainEvents.register(this.onUserCreated.bind(this), UserCreated.name)
  }

  private async onUserCreated(event: UserCreated): Promise<void> {
    const { user } = event

    try {
      let updateFundAccountUseCaseResult = await this.updateFundAccountUseCase.execute({
        memberId: user.userId.id.toString(),
        totalAmount: 0
      })
      if (updateFundAccountUseCaseResult.isLeft()) {
        console.error(updateFundAccountUseCaseResult.value.getValue())
      }

      console.log(`[AfterUserCreated]: Successfully executed CreateMember use case AfterUserCreated`)
    } catch (err) {
      console.log(`[AfterUserCreated]: Failed to execute CreateMember use case AfterUserCreated.`)
    }
  }
}
