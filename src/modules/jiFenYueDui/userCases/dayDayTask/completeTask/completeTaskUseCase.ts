import { Result, Either, left, right } from '../../../../../shared/core/Result'
import { IDayDayTaskRepo } from '../../../repos/dayDayRepo'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { DayDayTask } from '../../../domain/dayDayTask'
import { CompleteTaskDto } from './completeTaskDto'
import { DayDayTaskType } from '../../../domain/dayDayTaskType'
import { DayDayTaskService } from '../../../domain/service/dayDayTaskService'

type Response = Either<AppError.UnexpectedError | Result<any>, Result<void>>

export class CompleteTaskUseCase implements UseCase<CompleteTaskDto, Promise<Response>> {
  private dayDayTaskRepo: IDayDayTaskRepo
  private dayDayTaskService: DayDayTaskService

  constructor(dayDayTaskRepo: IDayDayTaskRepo, dayDayTaskService: DayDayTaskService) {
    this.dayDayTaskRepo = dayDayTaskRepo
    this.dayDayTaskService = dayDayTaskService
  }

  public async execute(request: CompleteTaskDto): Promise<Response> {
    try {
      const { userId, type } = request
      const dayDayTask = await this.dayDayTaskRepo.getByUserIdWithType(userId, type)

      if (!!dayDayTask === true) {
        return right(Result.ok<void>())
      }

      const dayDayTaskType = type as DayDayTaskType
      const reward = this.dayDayTaskService.getRewardByTaskType(dayDayTaskType)
      const isOneTime = this.dayDayTaskService.getIsOneTimeByType(dayDayTaskType)

      const dayDayTaskOrErrors = DayDayTask.create({
        type: dayDayTaskType,
        reward: reward,
        userId: userId,
        isReward: false,
        isOneTime
      })

      if (dayDayTaskOrErrors.isFailure) {
        return left(dayDayTaskOrErrors)
      }

      await this.dayDayTaskRepo.save(dayDayTaskOrErrors.getValue())

      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
