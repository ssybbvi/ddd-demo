import { IHandle } from '../../../shared/domain/events/IHandle'
import { DomainEvents } from '../../../shared/domain/events/DomainEvents'
import { UserUpdateInviteRecommendedUserIded } from '../../users/domain/events/userUpdateInviteRecommendedUserIded'
import { GetUserByInviteRecommendedUserIdUseCase } from '../../users/useCases/user/getUserByInviteRecommendedUserId/getUserByInviteRecommendedUserIdUseCase'
import { CompleteTaskUseCase } from '../userCases/dayDayTask/completeTask/completeTaskUseCase'
import { CompleteTaskDto } from '../userCases/dayDayTask/completeTask/completeTaskDto'
import { User } from '../../users/domain/user'

export class AfterUserUpdateInviteRecommendedUserIded implements IHandle<UserUpdateInviteRecommendedUserIded> {
  private completeTaskUseCase: CompleteTaskUseCase
  private getUserByInviteRecommendedUserIdUseCase: GetUserByInviteRecommendedUserIdUseCase

  constructor(
    completeTaskUseCase: CompleteTaskUseCase,
    getUserByInviteRecommendedUserIdUseCase: GetUserByInviteRecommendedUserIdUseCase
  ) {
    this.setupSubscriptions()
    this.completeTaskUseCase = completeTaskUseCase
    this.getUserByInviteRecommendedUserIdUseCase = getUserByInviteRecommendedUserIdUseCase
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
      console.log('开始处理推荐人任务')
      if (!user.inviteRecommendedUserId) {
        console.log(`[AfterUserCreated]:  新用户，没有推荐人，推荐任务终止 `)
        return
      }
      const useCaseResult = await this.getUserByInviteRecommendedUserIdUseCase.execute({
        userId: user.inviteRecommendedUserId.toString()
      })

      if (useCaseResult.isLeft()) {
        console.error(useCaseResult.value)
      }
      const recommendedUserList = useCaseResult.value.getValue() as User[]

      const todayRecommendedUserTotal = recommendedUserList.reduce((acc, item) => {
        return (acc += item.createAt > new Date().setHours(0, 0, 0, 0) ? 1 : 0)
      }, 0)

      let completeTaskDto: CompleteTaskDto
      if (todayRecommendedUserTotal === 1) {
        completeTaskDto = {
          userId: user.inviteRecommendedUserId,
          type: 'inviteOneFriends'
        }
      } else if (todayRecommendedUserTotal === 2) {
        completeTaskDto = {
          userId: user.inviteRecommendedUserId,
          type: 'inviteTwoFriends'
        }
      } else if (todayRecommendedUserTotal === 3) {
        completeTaskDto = {
          userId: user.inviteRecommendedUserId,
          type: 'inviteThreeFriends'
        }
      } else {
        console.log(`userId:${user.inviteRecommendedUserId} 推荐人数${todayRecommendedUserTotal}人，但是不给予奖励`)
        return
      }

      const completeTaskUseCaseUseCaseResultByInviteFriends = await this.completeTaskUseCase.execute(completeTaskDto)
      if (completeTaskUseCaseUseCaseResultByInviteFriends.isLeft()) {
        console.error(completeTaskUseCaseUseCaseResultByInviteFriends.value)
      }
      console.log(`[AfterUserCreated]:  新用户，完成推荐任务 `)
    } catch (err) {
      console.log(`[AfterUserCreated]:  新用户，完成推荐任务 ${err}`)
    }
  }
}
