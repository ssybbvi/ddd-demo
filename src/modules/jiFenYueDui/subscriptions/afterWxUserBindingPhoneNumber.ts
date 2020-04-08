import { IHandle } from '../../../shared/domain/events/IHandle'
import { DomainEvents } from '../../../shared/domain/events/DomainEvents'
import { CompleteTaskUseCase } from '../userCases/dayDayTask/completeTask/completeTaskUseCase'
import { WxUserBindingPhoneNumber } from '../../users/domain/events/wxUserBindingPhoneNumber'

export class AfterWxUserBindingPhoneNumber implements IHandle<WxUserBindingPhoneNumber> {
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
        domainEvenntFn: this.onWxUserBindingPhoneNumber.bind(this)
      },
      WxUserBindingPhoneNumber.name
    )
  }

  private async onWxUserBindingPhoneNumber(event: WxUserBindingPhoneNumber): Promise<void> {
    const { wxUser } = event

    try {
      const completeTaskUseCaseUseCaseResultByPhoneAuthorization = await this.completeTaskUseCase.execute({
        userId: wxUser.id.toString(),
        type: 'phoneAuthorization'
      })

      if (completeTaskUseCaseUseCaseResultByPhoneAuthorization.isLeft()) {
        console.error(completeTaskUseCaseUseCaseResultByPhoneAuthorization.value)
      }

      console.log(`[AfterWxUserBindingPhoneNumber]: 完成验证微信手机号码任务`)
    } catch (err) {
      console.log(`[AfterWxUserBindingPhoneNumber]: 完成验证微信手机号码任务 ${err}`)
    }
  }
}
