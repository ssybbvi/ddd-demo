import { IHandle } from '../../../shared/domain/events/IHandle'
import { DomainEvents } from '../../../shared/domain/events/DomainEvents'
import { CompleteTaskUseCase } from '../userCases/dayDayTask/completeTask/completeTaskUseCase'
import { BindingWxUserInfoed } from '../../users/domain/events/bindingWxUserInfoed'

export class AfterBindingWxUserInfoed implements IHandle<BindingWxUserInfoed> {
  private completeTaskUseCase: CompleteTaskUseCase

  constructor(completeTaskUseCase: CompleteTaskUseCase) {
    this.setupSubscriptions()
    this.completeTaskUseCase = completeTaskUseCase
  }

  setupSubscriptions(): void {
    // Register to the domain event
    DomainEvents.register(
      {
        isNeedAwait: true,
        domainEvenntFn: this.onBindingWxUserInfoed.bind(this)
      },
      BindingWxUserInfoed.name
    )
  }

  private async onBindingWxUserInfoed(event: BindingWxUserInfoed): Promise<void> {
    const { wxUser } = event

    try {
      const completeTaskUseCaseUseCaseResultByPhoneAuthorization = await this.completeTaskUseCase.execute({
        userId: wxUser.id.toString(),
        type: 'userInfo'
      })

      if (completeTaskUseCaseUseCaseResultByPhoneAuthorization.isLeft()) {
        console.error(completeTaskUseCaseUseCaseResultByPhoneAuthorization.value)
      }

      console.log(`[AfterBindingWxUserInfoed]: 完成微信授权任务`)
    } catch (err) {
      console.log(`[AfterBindingWxUserInfoed]: 完成微信授权任务 ${err}`)
    }
  }
}
