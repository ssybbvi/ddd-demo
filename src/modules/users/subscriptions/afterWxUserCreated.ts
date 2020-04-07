import { IHandle } from '../../../shared/domain/events/IHandle'
import { DomainEvents } from '../../../shared/domain/events/DomainEvents'
import { CraeteUseCase } from '../useCases/user/createUser/craeteUseCase'
import { WxUserCreated } from '../domain/events/wxUserCreated'

export class AfterWxUserCreated implements IHandle<WxUserCreated> {
  private craeteUseCase: CraeteUseCase

  constructor(craeteUseCase: CraeteUseCase) {
    this.setupSubscriptions()
    this.craeteUseCase = craeteUseCase
  }

  setupSubscriptions(): void {
    // Register to the domain event
    DomainEvents.register(
      {
        isNeedAwait: true,
        domainEvenntFn: this.onAfterWxUserCreated.bind(this)
      },
      WxUserCreated.name
    )
  }

  private async onAfterWxUserCreated(event: WxUserCreated): Promise<void> {
    const { wxUser } = event

    try {
      let result = await this.craeteUseCase.execute({ _id: wxUser.id.toString() })
      if (result.isLeft()) {
        console.error(result.value)
      }
      console.log(`[AfterWxUserCreated]: 创建微信用户后创建基本用户`)
    } catch (err) {
      console.log(`[AfterWxUserCreated]: 创建微信用户后创建基本用户 ${err}`)
    }
  }
}
