import { User } from '../../users/domain/user'
import { UserCreated } from '../../users/domain/events/userCreated'
import { IHandle } from '../../../shared/domain/events/IHandle'
import { CreateRecommendedUser } from '../userCases/recommendedUsers/createRecommendedUser/createRecommendedUser'
import { DomainEvents } from '../../../shared/domain/events/DomainEvents'

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
        domainEvenntFn: this.onUserCreated.bind(this)
      },
      UserCreated.name
    )
  }

  private async onUserCreated(event: UserCreated): Promise<void> {
    const { user } = event

    try {
      const result = await this.createRecommendedUser.execute({
        userId: user.userId.id.toString(),
        inviteToken: null
      })

      if (result.isLeft()) {
        console.error(result.value)
        return
      }

      console.log(`[AfterUserCreated]: 新用户创建推荐记录`)
    } catch (err) {
      console.log(`[AfterUserCreated]: 新用户创建推荐记录 ${err}`)
    }
  }
}
