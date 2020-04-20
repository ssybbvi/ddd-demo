import { IHandle } from '../../../shared/domain/events/IHandle'
import { DomainEvents } from '../../../shared/domain/events/DomainEvents'
import { CreateAppUserUseCase } from '../useCases/appUser/createAppUser/createAppUserUseCase'
import { AuthCodeCreated } from '../domain/events/authCodeCreated'


export class AfterAuthCodeCreated implements IHandle<AuthCodeCreated> {
  private createAppUserUseCase: CreateAppUserUseCase


  constructor(createAppUserUseCase: CreateAppUserUseCase) {
    this.setupSubscriptions()
    this.createAppUserUseCase = createAppUserUseCase
  }

  setupSubscriptions(): void {
    // Register to the domain event
    DomainEvents.register(
      {
        isNeedAwait: false,
        domainEvenntFn: this.onAfterAuthCodeCreated.bind(this)
      },
      AuthCodeCreated.name
    )
  }

  private async onAfterAuthCodeCreated(event: AuthCodeCreated): Promise<void> {
    const { authCode } = event
    const { appId, userId } = authCode
    try {
      const createAppUserUseCaseResult = await this.createAppUserUseCase.execute({
        appId, userId
      })
      if (createAppUserUseCaseResult.isLeft()) {
        console.error(createAppUserUseCaseResult.value)
      }
      console.log(`[AuthCodeCreated]: 创建开放用户记录`)
    } catch (err) {
      console.log(`[AuthCodeCreated]: 创建开放用户记录. ${err}`)
    }
  }
}
