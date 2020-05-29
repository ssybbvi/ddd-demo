import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { IStrategyRepo } from '../../../repos/strategyRepo'
import { Strategy } from '../../../domain/strategy'
import { IGetStrategyListDto } from './getStrategyListDto'

type Response = Either<AppError.UnexpectedError | Result<any>, Result<Strategy[]>>

export class GetStrategyListUseCase implements UseCase<IGetStrategyListDto, Promise<Response>> {
  private strategyRepo: IStrategyRepo

  constructor(strategyRepo: IStrategyRepo) {
    this.strategyRepo = strategyRepo
  }

  public async execute(request: IGetStrategyListDto): Promise<Response> {
    try {
      const {} = request
      const list = await this.strategyRepo.filter()

      return right(Result.ok<Strategy[]>(list))
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
