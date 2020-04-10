import { IHandle } from '../../../shared/domain/events/IHandle'
import { DomainEvents } from '../../../shared/domain/events/DomainEvents'
import { RefreshFundAccountUseCase } from '../userCases/fundAccounts/refreshFundAccount/refreshFundAccountUseCase'
import { FundInvalided } from '../domain/events/fundInvalided'

export class AfterFundInvalided implements IHandle<FundInvalided> {
  private refreshFundAccountUseCase: RefreshFundAccountUseCase

  constructor(refreshFundAccountUseCase: RefreshFundAccountUseCase) {
    this.setupSubscriptions()
    this.refreshFundAccountUseCase = refreshFundAccountUseCase
  }

  setupSubscriptions(): void {
    // Register to the domain event
    DomainEvents.register(
      {
        isNeedAwait: false,
        domainEvenntFn: this.onAfterFundInvalided.bind(this)
      },
      FundInvalided.name
    )
  }

  private async onAfterFundInvalided(event: FundInvalided): Promise<void> {
    const { fund } = event

    try {
      await this.refreshFundAccount(fund.incomeUserId)
      await this.refreshFundAccount(fund.paymentUserId)
      console.log(`[AfterFundInvalided]: 作废资金记录 重新统计总金额`)
    } catch (err) {
      console.log(`[AfterFundInvalided]: 作废资金记录 重新统计总金额 ${err}`)
    }
  }

  private async refreshFundAccount(recommendedUserId: string) {
    let refreshFundAccountUseCaseResult = await this.refreshFundAccountUseCase.execute({
      recommendedUserId: recommendedUserId
    })

    if (refreshFundAccountUseCaseResult.isLeft()) {
      console.error(refreshFundAccountUseCaseResult.value)
    }
  }
}
