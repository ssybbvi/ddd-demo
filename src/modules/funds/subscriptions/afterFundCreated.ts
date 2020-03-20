import { IHandle } from '../../../shared/domain/events/IHandle'
import { DomainEvents } from '../../../shared/domain/events/DomainEvents'
import { FundCreated } from '../domain/events/fundCreated'
import { RefreshFundAccountUseCase } from '../userCases/fundAccounts/refreshFundAccount/refreshFundAccountUseCase'

export class AfterFundCreated implements IHandle<FundCreated> {
  private refreshFundAccountUseCase: RefreshFundAccountUseCase

  constructor(
    refreshFundAccountUseCase: RefreshFundAccountUseCase,
  ) {
    this.setupSubscriptions()
    this.refreshFundAccountUseCase = refreshFundAccountUseCase
  }

  setupSubscriptions(): void {
    // Register to the domain event
    DomainEvents.register(this.onAfterLoginCreated.bind(this), FundCreated.name)
  }

  private async onAfterLoginCreated(event: FundCreated): Promise<void> {
    const { fund } = event

    try {
      await this.refreshFundAccount(fund.incomeMemberId)
      await this.refreshFundAccount(fund.paymentMemberId)
      console.log(`[AfterFundCreated]: Successfully executed AfterFundCreated use case AfterFundCreated`)
    } catch (err) {
      console.log(`[AfterFundCreated]: Failed to execute AfterFundCreated use case AfterFundCreated.`)
    }
  }

  private async refreshFundAccount(memberId: string) {
    let refreshFundAccountUseCaseResult = await this.refreshFundAccountUseCase.execute({
      memberId: memberId
    })

    if (refreshFundAccountUseCaseResult.isLeft()) {
      console.error(refreshFundAccountUseCaseResult.value)
    }
  }
}
