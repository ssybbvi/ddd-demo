import { UserCreated } from '../../users/domain/events/userCreated'
import { IHandle } from '../../../shared/domain/events/IHandle'
import { DomainEvents } from '../../../shared/domain/events/DomainEvents'
import { CompleteTaskUseCase } from '../userCases/completeTask/completeTaskUseCase'
import { CompleteTaskDto } from '../userCases/completeTask/completeTaskDto'
import { GetUserByInviteRecommendedUserIdUseCase } from '../../users/useCases/getUserByInviteRecommendedUserId/getUserByInviteRecommendedUserIdUseCase'
import { User } from '../../users/domain/user'

export class AfterUserCreated implements IHandle<UserCreated> {
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
        isNeedAwait: false,
        domainEvenntFn: this.onUserCreated.bind(this)
      },
      UserCreated.name
    )
  }

  private async onUserCreated(event: UserCreated): Promise<void> {
    const { user } = event

    try {
      const completeTaskUseCaseUseCaseResultByRegistered = await this.completeTaskUseCase.execute({
        userId: user.id.toString(),
        type: 'registered'
      })

      if (completeTaskUseCaseUseCaseResultByRegistered.isLeft()) {
        console.error(completeTaskUseCaseUseCaseResultByRegistered.value)
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

      console.log(`[AfterUserCreated]: 新用户，完成注册任务`)
    } catch (err) {
      console.log(`[AfterUserCreated]:  新用户，完成注册任务 ${err}`)
    }
  }
}
