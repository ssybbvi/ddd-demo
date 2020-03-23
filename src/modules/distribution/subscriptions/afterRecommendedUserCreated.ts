import { IHandle } from '../../../shared/domain/events/IHandle'
import { DomainEvents } from '../../../shared/domain/events/DomainEvents'
import { RecommendedUserCreated } from '../domain/events/recommendedUserCreated'
import { CreateRecommendedUserDistributionRelationUseCase } from '../userCases/recommendedUsers/createRecommendedUserDistributionRelation/createRecommendedUserDistributionRelationUseCase'

export class AfterRecommendedUserCreated implements IHandle<RecommendedUserCreated> {
  private createRecommendedUserDistributionRelationUseCase: CreateRecommendedUserDistributionRelationUseCase

  constructor(createRecommendedUserDistributionRelationUseCase: CreateRecommendedUserDistributionRelationUseCase) {
    this.setupSubscriptions()
    this.createRecommendedUserDistributionRelationUseCase = createRecommendedUserDistributionRelationUseCase
  }

  setupSubscriptions(): void {
    // Register to the domain event
    DomainEvents.register(this.onUserCreated.bind(this), RecommendedUserCreated.name)
  }

  private async onUserCreated(event: RecommendedUserCreated): Promise<void> {
    const { recommendedUser } = event
    try {
      await this.createRecommendedUserDistributionRelationUseCase.execute({
        recommendedUserId: recommendedUser.id.toString()
      })
      console.log(`[AfterRecommendedUserCreated]: Successfully executed CreateRecommendedUser use case AfterRecommendedUserCreated`)
    } catch (err) {
      console.log(`[AfterRecommendedUserCreated]: Failed to execute CreateRecommendedUser use case AfterRecommendedUserCreated.`)
    }
  }
}
