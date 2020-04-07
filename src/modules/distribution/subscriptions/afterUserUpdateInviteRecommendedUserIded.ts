import { User } from '../../users/domain/user'
import { IHandle } from '../../../shared/domain/events/IHandle'
import { CreateRecommendedUser } from '../userCases/recommendedUsers/createRecommendedUser/createRecommendedUser'
import { DomainEvents } from '../../../shared/domain/events/DomainEvents'
import { UserUpdateInviteRecommendedUserIded } from '../../users/domain/events/userUpdateInviteRecommendedUserIded'

export class AfterUserUpdateInviteRecommendedUserIded implements IHandle<UserUpdateInviteRecommendedUserIded> {
  private createRecommendedUser: CreateRecommendedUser

  constructor(createRecommendedUser: CreateRecommendedUser) {
    this.setupSubscriptions()
    this.createRecommendedUser = createRecommendedUser
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      {
        isNeedAwait: true,
        domainEvenntFn: this.onUserUpdateInviteRecommendedUserIded.bind(this)
      },
      UserUpdateInviteRecommendedUserIded.name
    )
  }

  private async onUserUpdateInviteRecommendedUserIded(event: UserUpdateInviteRecommendedUserIded): Promise<void> {
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

      console.log(`[AfterUserUpdateInviteRecommendedUserIded]: 新用户创建推荐记录`)
    } catch (err) {
      console.log(`[AfterUserUpdateInviteRecommendedUserIded]: 新用户创建推荐记录 ${err}`)
    }
  }
}
