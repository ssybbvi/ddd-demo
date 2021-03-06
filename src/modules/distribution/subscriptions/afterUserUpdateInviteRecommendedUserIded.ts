import { IHandle } from '../../../shared/domain/events/IHandle'
import { DomainEvents } from '../../../shared/domain/events/DomainEvents'
import { CreateRecommendedUser } from '../userCases/recommendedUsers/createRecommendedUser/createRecommendedUser'
import { UserUpdateInviteRecommendedUserIded } from '../../users/domain/events/userUpdateInviteRecommendedUserIded'

export class AfterUserUpdateInviteRecommendedUserIded implements IHandle<UserUpdateInviteRecommendedUserIded> {
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
        domainEvenntFn: this.onAfterUserUpdateInviteRecommendedUserIded.bind(this)
      },
      UserUpdateInviteRecommendedUserIded.name
    )
  }

  private async onAfterUserUpdateInviteRecommendedUserIded(event: UserUpdateInviteRecommendedUserIded): Promise<void> {
    const { user } = event

    try {
      let createRecommendedUserUseCaseValue = await this.createRecommendedUser.execute({
        userId: user.id.toString()
      })

      if (createRecommendedUserUseCaseValue.isLeft()) {
        console.error(createRecommendedUserUseCaseValue.value)
      }

      console.log(`[AfterUserUpdateInviteRecommendedUserIded]: 根据推荐人创建分销关系`)
    } catch (err) {
      console.log(`[AfterUserUpdateInviteRecommendedUserIded]: 根据推荐人创建分销关系 ${err}`)
    }
  }
}
