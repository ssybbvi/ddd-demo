import { Result, Either, left, right } from '../../../../../shared/core/Result'
import { IDayDayTaskRepo } from '../../../repos/dayDayRepo'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { GetDayDayTaskDto } from './getDayDayTaskListDto'
import { DayDayTask } from '../../../domain/dayDayTask'

type Response = Either<AppError.UnexpectedError | Result<any>, Result<DayDayTask[]>>

export class GetDayDayTaskListUseCase implements UseCase<GetDayDayTaskDto, Promise<Response>> {
  private dayDayTaskRepo: IDayDayTaskRepo

  constructor(dayDayTaskRepo: IDayDayTaskRepo) {
    this.dayDayTaskRepo = dayDayTaskRepo
  }

  public async execute(request: GetDayDayTaskDto): Promise<Response> {
    try {
      const { userId } = request

      const dayDayTaskList = await this.dayDayTaskRepo.filter(userId)

      return right(Result.ok<DayDayTask[]>(dayDayTaskList))
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
