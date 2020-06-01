import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { IUpdateActivityDto } from './updateActivityDto'
import { IActivityRepo } from '../../../repos/activityRepo'

type Response = Either<AppError.UnexpectedError | Result<any>, Result<void>>

export class UpdateActivityUseCase implements UseCase<IUpdateActivityDto, Promise<Response>> {
  private activityRepo: IActivityRepo

  constructor(activityRepo: IActivityRepo) {
    this.activityRepo = activityRepo
  }

  public async execute(request: IUpdateActivityDto): Promise<Response> {
    try {
      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
