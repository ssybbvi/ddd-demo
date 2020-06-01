import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { ICreateActivityDto } from './createActivityDto'
import { IActivityRepo } from '../../../repos/activityRepo'
import { Activity } from '../../../domain/activity'
import { StrategyMap } from '../../../mappers/strategyMap'
import { Strategy } from '../../../domain/strategy'

type Response = Either<AppError.UnexpectedError | Result<any>, Result<void>>

export class CreateActivityUseCase implements UseCase<ICreateActivityDto, Promise<Response>> {
  private activityRepo: IActivityRepo

  constructor(activityRepo: IActivityRepo) {
    this.activityRepo = activityRepo
  }

  public async execute(request: ICreateActivityDto): Promise<Response> {
    try {
      const { isEnable, strategyDto } = request

      const strategyResult = StrategyMap.dtoToDomain(strategyDto)
      const strategyResultValue = strategyResult.value
      if (strategyResult.isLeft()) {
        return left(strategyResultValue)
      }

      const strategy = strategyResultValue.getValue() as Strategy

      const activityOrError = Activity.create({
        isEnable,
        strategy,
      })
      if (activityOrError.isFailure) {
        return left(activityOrError)
      }

      await this.activityRepo.save(activityOrError.getValue())

      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
