import { IHandle } from '../../../shared/domain/events/IHandle'
import { DomainEvents } from '../../../shared/domain/events/DomainEvents'
import { DayDayTaskCreated } from '../domain/events/dayDayTaskCreated'
import { CreateScheduledTaskUseCase } from '../userCases/scheduledTask/createScheduledTask/createScheduledTaskUseCase'
import { GetWxCurrentUserUseCase } from '../../users/useCases/wxUser/getWxCurrentUser/getWxCurrentUserUseCase'
import { WxUser } from '../../users/domain/wxUser'
import { GetDailySignInCountByUserIdUseCase } from '../../distribution/userCases/signIns/getDailySignInCountByUserId/getDailySignInCountByUserIdUseCase'
import { DayDayTask } from '../domain/dayDayTask'

export class AfterDayDayTaskCreated implements IHandle<DayDayTaskCreated> {
  private createScheduledTaskUseCase: CreateScheduledTaskUseCase
  private getWxCurrentUserUseCase: GetWxCurrentUserUseCase
  private getDailySignInCountByUserIdUseCase: GetDailySignInCountByUserIdUseCase

  constructor(
    createScheduledTaskUseCase: CreateScheduledTaskUseCase,
    getWxCurrentUserUseCase: GetWxCurrentUserUseCase,
    getDailySignInCountByUserIdUseCase: GetDailySignInCountByUserIdUseCase
  ) {
    this.setupSubscriptions()
    this.createScheduledTaskUseCase = createScheduledTaskUseCase
    this.getWxCurrentUserUseCase = getWxCurrentUserUseCase
    this.getDailySignInCountByUserIdUseCase = getDailySignInCountByUserIdUseCase
  }

  setupSubscriptions(): void {
    // Register to the domain event
    DomainEvents.register(
      {
        isNeedAwait: false,
        domainEvenntFn: this.onAfterDayDayTaskCreated.bind(this)
      },
      DayDayTaskCreated.name
    )
  }

  private async onAfterDayDayTaskCreated(event: DayDayTaskCreated): Promise<void> {
    const { dayDayTask } = event

    try {
      if (dayDayTask.type === 'remind') {
        this.remindTask(dayDayTask)
        console.log(`[AfterDayDayTaskCreated]: 完成提醒任务，创建提醒定时提醒任务`)
      }
    } catch (err) {
      console.log(`[AfterDayDayTaskCreated]: 完成提醒任务，创建提醒定时提醒任务 ${err}`)
    }
  }

  private async remindTask(dayDayTask: DayDayTask) {
    const today = new Date().setHours(0, 0, 0, 0)
    const executionTime = today + 1000 * 60 * 60 * (24 + 10.5) //明天的10点半执行

    const getWxCurrentUserUseCaseResult = await this.getWxCurrentUserUseCase.execute({ userId: dayDayTask.userId })
    if (getWxCurrentUserUseCaseResult.isLeft()) {
      console.error(getWxCurrentUserUseCaseResult.value)
      return
    }
    const wxUser = getWxCurrentUserUseCaseResult.value.getValue() as WxUser

    const getDailySignInCountByUserIdUseCaseResult = await this.getDailySignInCountByUserIdUseCase.execute({
      userId: dayDayTask.userId
    })
    const getDailySignInCountByUserIdUseCaseResultValue = getDailySignInCountByUserIdUseCaseResult.value
    if (getDailySignInCountByUserIdUseCaseResult.isLeft()) {
      console.error(getDailySignInCountByUserIdUseCaseResult.value)
      return
    }
    const signInCount = getDailySignInCountByUserIdUseCaseResultValue.getValue() as number

    let argument = {
      touser: wxUser.openId,
      template_id: '5VzCwVkN0AIe97P7WjujwA5jDmeNUiq_Fo1hKFC0NDw',
      page: 'pages/index/index',
      data: {
        thing1: {
          value: '每日签到'
        },
        thing2: {
          value: '积分'
        },
        number3: {
          value: signInCount
        },
        thing4: {
          value: '连续签到5天有惊喜，可领积分大礼包'
        }
      }
    }

    console.log('argument', argument)

    const result = await this.createScheduledTaskUseCase.execute({
      argument: argument,
      userId: dayDayTask.userId,
      type: 'notificationWxSubscribe',
      executionTime: executionTime,
      relationId: dayDayTask.id.toString()
    })

    if (result.isLeft()) {
      console.error(result.value)
      return
    }
  }
}
