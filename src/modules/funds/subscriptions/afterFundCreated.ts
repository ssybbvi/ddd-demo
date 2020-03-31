import { IHandle } from '../../../shared/domain/events/IHandle'
import { DomainEvents } from '../../../shared/domain/events/DomainEvents'
import { FundCreated } from '../domain/events/fundCreated'
import { RefreshFundAccountUseCase } from '../userCases/fundAccounts/refreshFundAccount/refreshFundAccountUseCase'

export class AfterFundCreated implements IHandle<FundCreated> {
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
        domainEvenntFn: this.onAfterFundCreated.bind(this)
      },
      FundCreated.name
    )
  }

  private async onAfterFundCreated(event: FundCreated): Promise<void> {
    const { fund } = event

    try {
      await this.refreshFundAccount(fund.incomeUserId)
      await this.refreshFundAccount(fund.paymentUserId)
      console.log(`[AfterFundCreated]: 资金变动 重新统计总金额`)
    } catch (err) {
      console.log(`[AfterFundCreated]: 资金变动 重新统计总金额 ${err}`)
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
