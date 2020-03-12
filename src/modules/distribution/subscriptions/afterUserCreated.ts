import { User } from '../../users/domain/user'
import { UserCreated } from '../../users/domain/events/userCreated'
import { IHandle } from '../../../shared/domain/events/IHandle'
import { CreateMember } from '../userCases/members/createMember/createMember'
import { DomainEvents } from '../../../shared/domain/events/DomainEvents'
import { UpdateFundAccountUseCase } from '../userCases/fundAccounts/updateFundAccount/updateFundAccountUseCase'
import { updateFundAccountUseCase } from '../userCases/fundAccounts/updateFundAccount'

export class AfterUserCreated implements IHandle<UserCreated> {
  private createMember: CreateMember
  private updateFundAccountUseCase: UpdateFundAccountUseCase

  constructor(createMember: CreateMember, updateFundAccount: UpdateFundAccountUseCase) {
    this.setupSubscriptions()
    this.createMember = createMember
    this.updateFundAccountUseCase = updateFundAccountUseCase
  }

  setupSubscriptions(): void {
    // Register to the domain event
    DomainEvents.register(this.onUserCreated.bind(this), UserCreated.name)
  }

  private async onUserCreated(event: UserCreated): Promise<void> {
    const { user, extra } = event

    try {
      let createMemberUseCaseResult = await this.createMember.execute({
        userId: user.userId.id.toString(),
        inviteToken: extra ? extra.inviteToken : null
      })
      if (createMemberUseCaseResult.isLeft()) {
        console.error(createMemberUseCaseResult.value.getValue())
      }

      let updateFundAccountUseCaseResult = await this.updateFundAccountUseCase.execute({
        memberId: user.userId.id.toString(),
        totalAmount: 0
      })
      if (updateFundAccountUseCaseResult.isLeft()) {
        console.error(updateFundAccountUseCaseResult.value.getValue())
      }

      console.log(`[AfterUserCreated]: Successfully executed CreateMember use case AfterUserCreated`)
    } catch (err) {
      console.log(`[AfterUserCreated]: Failed to execute CreateMember use case AfterUserCreated.`)
    }
  }
}
