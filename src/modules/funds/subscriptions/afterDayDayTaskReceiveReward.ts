import { IHandle } from '../../../shared/domain/events/IHandle'
import { DomainEvents } from '../../../shared/domain/events/DomainEvents'
import { FundService } from '../domain/services/fundService'
import { SignInCreated } from '../../distribution/domain/events/signInCreated'
import { Fund } from '../domain/fund'
import { FundAmount } from '../domain/fundAmount'
import { DayDayTaskReceiveReward } from '../../jiFenYueDui/domain/events/dayDayTaskReceiveReward'

export class AfterDayDayTaskReceiveReward implements IHandle<DayDayTaskReceiveReward> {
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
        domainEvenntFn: this.onAfterDayDayTaskReceiveReward.bind(this)
      },
      DayDayTaskReceiveReward.name
    )
  }

  private async onAfterDayDayTaskReceiveReward(event: DayDayTaskReceiveReward): Promise<void> {
    const { dayDayTask } = event

    try {
      const fundAmountOrError = FundAmount.create({
        fundAmount: dayDayTask.reward
      })
      if (fundAmountOrError.isFailure) {
        console.error(fundAmountOrError.error)
        return
      }
      const fundOrErrors = Fund.create({
        incomeUserId: dayDayTask.userId,
        amount: fundAmountOrError.getValue(),
        type: dayDayTask.type,
        relationId: dayDayTask.id.toString()
      })

      const distributionResult = await this.fundService.distribution(fundOrErrors.getValue())
      if (distributionResult.isLeft()) {
        console.error(distributionResult.value)
        return
      }

      console.log(`[DayDayTaskReceiveReward]: 完成任务奖励积分`)
    } catch (err) {
      console.log(`[DayDayTaskReceiveReward]: 完成任务奖励积分 ${err}`)
    }
  }
}
