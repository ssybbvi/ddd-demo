import { IHandle } from '../../../shared/domain/events/IHandle'
import { DomainEvents } from '../../../shared/domain/events/DomainEvents'
import { MemberCreated } from '../domain/events/memberCreated'
import { CreateMemberDistributionRelationUseCase } from '../userCases/members/createMemberDistributionRelation/createMemberDistributionRelationUseCase'

export class AfterMemberCreated implements IHandle<MemberCreated> {
  private createMemberDistributionRelationUseCase: CreateMemberDistributionRelationUseCase

  constructor(createMemberDistributionRelationUseCase: CreateMemberDistributionRelationUseCase) {
    this.setupSubscriptions()
    this.createMemberDistributionRelationUseCase = createMemberDistributionRelationUseCase
  }

  setupSubscriptions(): void {
    // Register to the domain event
    DomainEvents.register(this.onUserCreated.bind(this), MemberCreated.name)
  }

  private async onUserCreated(event: MemberCreated): Promise<void> {
    const { member } = event
    try {
      await this.createMemberDistributionRelationUseCase.execute({
        memberId: member.id.toString()
      })
      console.log(`[AfterMemberCreated]: Successfully executed CreateMember use case AfterMemberCreated`)
    } catch (err) {
      console.log(`[AfterMemberCreated]: Failed to execute CreateMember use case AfterMemberCreated.`)
    }
  }
}
