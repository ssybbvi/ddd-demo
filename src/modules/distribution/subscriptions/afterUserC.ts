import { IHandle } from '../../../shared/domain/events/IHandle'
import { DomainEvents } from '../../../shared/domain/events/DomainEvents'
import { CreateRecommendedUser } from '../userCases/recommendedUsers/createRecommendedUser/createRecommendedUser'
import { UserCreated } from '../../users/domain/events/userCreated'

export class AfterUserCreated implements IHandle<UserCreated> {
  private createRecommendedUser: CreateRecommendedUser

  constructor(createRecommendedUser: CreateRecommendedUser) {
    this.setupSubscriptions()
    this.createRecommendedUser = createRecommendedUser
  }

  setupSubscriptions(): void {
    // Register to the domain event
    DomainEvents.register(
      {
        isNeedAwait: true,
        domainEvenntFn: this.onAfterUserCreated.bind(this)
      },
      UserCreated.name
    )
  }

  private async onAfterUserCreated(event: UserCreated): Promise<void> {
    const { user } = event

    try {
      let createRecommendedUserUseCaseValue = await this.createRecommendedUser.execute({
        userId: user.id.toString()
      })

      if (createRecommendedUserUseCaseValue.isLeft()) {
        console.error(createRecommendedUserUseCaseValue.value)
      }

      console.log(`[AfterUserCreated]: 新用户创建分销空记录关系`)
    } catch (err) {
      console.log(`[AfterUserCreated]: 新用户创建分销空记录关系 ${err}`)
    }
  }
}
