import { UserCreated } from '../../users/domain/events/userCreated'
import { IHandle } from '../../../shared/domain/events/IHandle'
import { DomainEvents } from '../../../shared/domain/events/DomainEvents'
import { CreateFundAccountUseCase } from '../userCases/fundAccounts/createFundAccount/createFundAccountUseCase'

export class AfterUserCreated implements IHandle<UserCreated> {
  private createFundAccountUseCase: CreateFundAccountUseCase

  constructor(createFundAccountUseCase: CreateFundAccountUseCase) {
    this.setupSubscriptions()
    this.createFundAccountUseCase = createFundAccountUseCase
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
      let createFundAccountUseCaseResult = await this.createFundAccountUseCase.execute({
        recommendedUserId: user.userId.id.toString()
      })
      if (createFundAccountUseCaseResult.isLeft()) {
        console.error(createFundAccountUseCaseResult.value.getValue())
      }

      console.log(`[AfterUserCreated]: Successfully executed CreateFundAccountUseCase use case AfterUserCreated`)
    } catch (err) {
      console.log(`[AfterUserCreated]: Failed to execute CreateFundAccountUseCase use case AfterUserCreated.`)
    }
  }
}
