import { IHandle } from '../../../shared/domain/events/IHandle'
import { DomainEvents } from '../../../shared/domain/events/DomainEvents'
import { UserCreated } from '../domain/events/userCreated'
import { CreateRobotUserCase } from '../useCases/createRobotUser/createRobotUserUseCase'
import { CreateRobotUserDtoResult } from '../useCases/createRobotUser/createRobotUserDtoResult'

export class AfterUserCreated implements IHandle<UserCreated> {
  private createRobotUserCase: CreateRobotUserCase

  constructor(createRobotUserCase: CreateRobotUserCase) {
    this.setupSubscriptions()
    this.createRobotUserCase = createRobotUserCase
  }

  setupSubscriptions(): void {
    // Register to the domain event
    DomainEvents.register(this.onUserCreated.bind(this), UserCreated.name)
  }

  private async onUserCreated(event: UserCreated): Promise<void> {
    const { user } = event

    try {
      if (user.from === 'robot') {
        return
      }

      let createRobotUserCaseResult = await this.createRobotUserCase.execute({
        inviteToken: user.id.toString()
      })
      if (createRobotUserCaseResult.isLeft()) {
        console.error(createRobotUserCaseResult.value.getValue())
      }

      const createRobotUserDtoResultValue: CreateRobotUserDtoResult = await createRobotUserCaseResult.value.getValue()
      let createRobotUserCaseResult1 = await this.createRobotUserCase.execute({
        inviteToken: createRobotUserDtoResultValue.userId
      })
      if (createRobotUserCaseResult1.isLeft()) {
        console.error(createRobotUserCaseResult1.value.getValue())
      }

      console.log(`[AfterUserCreated]: Successfully executed CreateMember use case AfterUserCreated`)
    } catch (err) {
      console.log(`[AfterUserCreated]: Failed to execute CreateMember use case AfterUserCreated.`)
    }
  }
}
