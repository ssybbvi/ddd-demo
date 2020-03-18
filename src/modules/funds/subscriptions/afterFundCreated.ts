import { IHandle } from '../../../shared/domain/events/IHandle'
import { DomainEvents } from '../../../shared/domain/events/DomainEvents'
import { FundCreated } from '../domain/events/fundCreated'
import { GetTotalAmountByMemberIdUseCase } from '../userCases/funds/getTotalAmountByMemberId/getTotalAmountByMemberIdUseCase'
import { UpdateFundAccountUseCase } from '../userCases/fundAccounts/updateFundAccount/updateFundAccountUseCase'
import { GetTotalAmountByMemberIdDtoResult } from '../userCases/funds/getTotalAmountByMemberId/getTotalAmountByMemberIdDtoResult'

export class AfterFundCreated implements IHandle<FundCreated> {
  private getTotalAmountByMemberIdUseCase: GetTotalAmountByMemberIdUseCase
  private updateFundAccountUseCase: UpdateFundAccountUseCase

  constructor(
    getTotalAmountByMemberIdUseCase: GetTotalAmountByMemberIdUseCase,
    updateFundAccountUseCase: UpdateFundAccountUseCase
  ) {
    this.setupSubscriptions()
    this.getTotalAmountByMemberIdUseCase = getTotalAmountByMemberIdUseCase
    this.updateFundAccountUseCase = updateFundAccountUseCase
  }

  setupSubscriptions(): void {
    // Register to the domain event
    DomainEvents.register(this.onAfterLoginCreated.bind(this), FundCreated.name)
  }

  private async onAfterLoginCreated(event: FundCreated): Promise<void> {
    const { fund } = event

    try {
      await this.updateMemberTotalAmount(fund.incomeMemberId)
      //await this.updateMemberTotalAmount(fund.paymentMemberId.id.toString())
      console.log(`[AfterFundCreated]: Successfully executed AfterFundCreated use case AfterFundCreated`)
    } catch (err) {
      console.log(`[AfterFundCreated]: Failed to execute AfterFundCreated use case AfterFundCreated.`)
    }
  }

  private async updateMemberTotalAmount(memberId: string) {
    let getTotalAmountByMemberIdUseCaseResult = await this.getTotalAmountByMemberIdUseCase.execute({
      memberId: memberId
    })

    if (getTotalAmountByMemberIdUseCaseResult.isLeft()) {
      console.error(getTotalAmountByMemberIdUseCaseResult.value)
    }

    let getTotalAmountByMemberIdDtoResult = getTotalAmountByMemberIdUseCaseResult.value.getValue() as GetTotalAmountByMemberIdDtoResult

    let updateFundAccountUseCaseResult = await this.updateFundAccountUseCase.execute({
      memberId: memberId,
      totalAmount: getTotalAmountByMemberIdDtoResult.totalAmount
    })

    if (updateFundAccountUseCaseResult.isLeft()) {
      console.error(updateFundAccountUseCaseResult.value)
    }
  }
}