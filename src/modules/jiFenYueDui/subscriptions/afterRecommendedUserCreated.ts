import { IHandle } from '../../../shared/domain/events/IHandle'
import { DomainEvents } from '../../../shared/domain/events/DomainEvents'
import { RecommendedUserCreated } from '../../distribution/domain/events/recommendedUserCreated'
import { GetUserByInviteRecommendedUserIdUseCase } from '../../distribution/userCases/recommendedUsers/getUserByInviteRecommendedUserId/getUserByInviteRecommendedUserIdUseCase'
import { CompleteTaskUseCase } from '../userCases/completeTask/completeTaskUseCase'
import { RecommendedUser } from '../../distribution/domain/recommendedUser'
import { CompleteTaskDto } from '../userCases/completeTask/completeTaskDto'


export class AfterRecommendedUserCreated implements IHandle<RecommendedUserCreated> {
  private getUserByInviteRecommendedUserIdUseCase: GetUserByInviteRecommendedUserIdUseCase
  private completeTaskUseCase: CompleteTaskUseCase

  constructor(getUserByInviteRecommendedUserIdUseCase: GetUserByInviteRecommendedUserIdUseCase,
    completeTaskUseCase: CompleteTaskUseCase) {
    this.setupSubscriptions()
    this.getUserByInviteRecommendedUserIdUseCase = getUserByInviteRecommendedUserIdUseCase
    this.completeTaskUseCase = completeTaskUseCase
  }

  setupSubscriptions(): void {
    // Register to the domain event
    DomainEvents.register(
      {
        isNeedAwait: false,
        domainEvenntFn: this.onUserCreated.bind(this)
      },
      RecommendedUserCreated.name
    )
  }

  private async onUserCreated(event: RecommendedUserCreated): Promise<void> {
    const { recommendedUser } = event
    try {
      const useCaseResult = await this.getUserByInviteRecommendedUserIdUseCase.execute({
        userId: recommendedUser.inviteRecommendedUserId.toString()
      })

      if (useCaseResult.isLeft()) {
        console.error(useCaseResult.value)
      }


      const recommendedUserList = useCaseResult.value.getValue() as RecommendedUser[]

      const todayRecommendedUserTotal = recommendedUserList.reduce((acc, item) => { return acc += item.createAt > new Date().setHours(0, 0, 0, 0) ? 1 : 0 }, 0)

      let completeTaskDto: CompleteTaskDto
      if (todayRecommendedUserTotal === 1) {
        completeTaskDto = {
          userId: recommendedUser.inviteRecommendedUserId,
          type: 'inviteOneFriends'
        }
      } else if (todayRecommendedUserTotal === 2) {
        completeTaskDto = {
          userId: recommendedUser.inviteRecommendedUserId,
          type: 'inviteTwoFriends'
        }
      } else if (todayRecommendedUserTotal === 3) {
        completeTaskDto = {
          userId: recommendedUser.inviteRecommendedUserId,
          type: 'inviteThreeFriends'
        }
      } else {
        console.log(`userId:${recommendedUser.inviteRecommendedUserId} 推荐人数${todayRecommendedUserTotal}人，但是不给予奖励`)
        return
      }

      const completeTaskUseCaseUseCaseResult = await this.completeTaskUseCase.execute(completeTaskDto)
      if (completeTaskUseCaseUseCaseResult.isLeft()) {
        console.error(completeTaskUseCaseUseCaseResult.value)
      }

      console.log(
        `[AfterRecommendedUserCreated]: 推荐用户奖励积分成功`
      )
    } catch (err) {
      console.log(
        `[AfterRecommendedUserCreated]: 推荐用户奖励积分失败  ${err}`
      )
    }
  }
}
