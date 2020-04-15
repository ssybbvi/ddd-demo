import { Result, Either, left, right } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { CreateScheduledTaskDto } from './createScheduledTaskDto'
import { IScheduledTaskRepo } from '../../../repos/scheduledTaskRepo'
import { ScheduledTask } from '../../../domain/scheduledTask'

type Response = Either<AppError.UnexpectedError, Result<void>>

export class CreateScheduledTaskUseCase implements UseCase<CreateScheduledTaskDto, Promise<Response>> {
  private scheduledTaskRepo: IScheduledTaskRepo

  constructor(scheduledTaskRepo: IScheduledTaskRepo) {
    this.scheduledTaskRepo = scheduledTaskRepo
  }

  public async execute(request: CreateScheduledTaskDto): Promise<Response> {
    try {
      const { argument, userId, type, executionTime, relationId } = request

      const scheduledTaskOrErrors = ScheduledTask.create({
        argument,
        userId,
        type,
        executionTime,
        relationId
      })

      if (scheduledTaskOrErrors.isFailure) {
        return left(scheduledTaskOrErrors)
      }

      await this.scheduledTaskRepo.save(scheduledTaskOrErrors.getValue())

      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
