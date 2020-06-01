import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { IActivityRepo } from '../../../repos/activityRepo'
import { Activity } from '../../../domain/activity'
import { IGetActivityListDto } from './getActivityListDto'

type Response = Either<AppError.UnexpectedError | Result<any>, Result<Activity[]>>

export class GetActivityListUseCase implements UseCase<IGetActivityListDto, Promise<Response>> {
  private activityRepo: IActivityRepo

  constructor(activityRepo: IActivityRepo) {
    this.activityRepo = activityRepo
  }

  public async execute(request: IGetActivityListDto): Promise<Response> {
    try {
      const {} = request
      const list = await this.activityRepo.filter()

      return right(Result.ok<Activity[]>(list))
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
