import { IHandle } from '../../../shared/domain/events/IHandle'
import { DomainEvents } from '../../../shared/domain/events/DomainEvents'
import { FundService } from '../domain/services/fundService'
import { SignInSuperRewared } from '../../distribution/domain/events/signInSuperRewared'
import { FundAmount } from '../domain/fundAmount'
import { Fund } from '../domain/fund'

export class AfterSignInSuperRewared implements IHandle<SignInSuperRewared> {
  private fundService: FundService

  constructor(fundService: FundService) {
    this.setupSubscriptions()
    this.fundService = fundService
  }

  setupSubscriptions(): void {
    // Register to the domain event
    DomainEvents.register(
      {
        isNeedAwait: false,
        domainEvenntFn: this.onAfterSignInSuperRewared.bind(this)
      },
      SignInSuperRewared.name
    )
  }

  private async onAfterSignInSuperRewared(event: SignInSuperRewared): Promise<void> {
    const { signIn } = event

    try {
      const fundAmountOrError = FundAmount.create({
        fundAmount: signIn.superReward
      })
      if (fundAmountOrError.isFailure) {
        console.error(fundAmountOrError.error)
        return
      }
      const fundOrErrors = Fund.create({
        incomeUserId: signIn.userId,
        amount: fundAmountOrError.getValue(),
        type: 'signInSuperReward',
        relationId: signIn.id.toString()
      })

      const distributionResult = await this.fundService.distribution(fundOrErrors.getValue())
      if (distributionResult.isLeft()) {
        console.error(distributionResult.value)
        return
      }
      console.log(
        `[AfterSignInSuperRewared]: 超级签到，增加资金记录`
      )
    } catch (err) {
      console.log(
        `[AfterSignInSuperRewared]: 超级签到，增加资金记录 ${err}`
      )
    }
  }
}
