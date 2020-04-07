import { Result, Either, left, right } from '../../../../../shared/core/Result'
import { IDayDayTaskRepo } from '../../../repos/dayDayRepo'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { DayDayTask } from '../../../domain/dayDayTask'
import { ReceiveRewardDto } from './receiveRewardDto'
import { ReceiveRewardErrors } from './receiveRewardErrors'

type Response = Either<
  | AppError.UnexpectedError
  | ReceiveRewardErrors.DayDayTaskNotFound
  | ReceiveRewardErrors.RewardAlreadyReceive
  | Result<any>,
  Result<DayDayTask>
>

export class ReceiveRewardUseCase implements UseCase<ReceiveRewardDto, Promise<Response>> {
  private dayDayTaskRepo: IDayDayTaskRepo

  constructor(dayDayTaskRepo: IDayDayTaskRepo) {
    this.dayDayTaskRepo = dayDayTaskRepo
  }

  public async execute(request: ReceiveRewardDto): Promise<Response> {
    try {
      const { userId, type } = request

      const dayDayTask = await this.dayDayTaskRepo.getByUserIdWithType(userId, type)
      if (!!dayDayTask === false) {
        return left(new ReceiveRewardErrors.DayDayTaskNotFound())
      }

      if (dayDayTask.isReward) {
        return left(new ReceiveRewardErrors.RewardAlreadyReceive())
      }

      dayDayTask.receiveReward()
      await this.dayDayTaskRepo.save(dayDayTask)

      return right(Result.ok<DayDayTask>(dayDayTask))
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
