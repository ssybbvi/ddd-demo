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
    DomainEvents.register(this.onUserCreated.bind(this), UserCreated.name)
  }

  private async onUserCreated(event: UserCreated): Promise<void> {
    const { user, extra } = event

    try {
      const result=  await this.createRecommendedUser.execute({
        userId: user.userId.id.toString(),
        inviteToken: extra ? extra.inviteToken : null
      })

      if(result.isLeft()){
        console.error(result.value)
        return 
      }

      console.log(`[AfterUserCreated]: Successfully executed CreateRecommendedUser use case AfterUserCreated`)
    } catch (err) {
      console.log(`[AfterUserCreated]: Failed to execute CreateRecommendedUser use case AfterUserCreated.`)
    }
  }
}
