import { IHandle } from '../../../shared/domain/events/IHandle'
import { DomainEvents } from '../../../shared/domain/events/DomainEvents'
import { CraeteUseCase } from '../useCases/user/createUser/craeteUseCase'
import { UpUserCreated } from '../domain/events/upUserCreated'

export class AfterUpUserCreated implements IHandle<UpUserCreated> {
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
        domainEvenntFn: this.onAfterUpUserCreated.bind(this)
      },
      UpUserCreated.name
    )
  }

  private async onAfterUpUserCreated(event: UpUserCreated): Promise<void> {
    const { wxUser } = event

    try {
      let result = await this.craeteUseCase.execute({ _id: wxUser.id.toString() })
      if (result.isLeft()) {
        console.error(result.value)
      }
      console.log(`[AfterUpUserCreated]: 创建帐户密码登录方式用户后创建基本用户`)
    } catch (err) {
      console.log(`[AfterUpUserCreated]: 创建帐户密码登录方式用户后创建基本用户 ${err}`)
    }
  }
}
