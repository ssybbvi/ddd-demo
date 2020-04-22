import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { BargainOrder } from '../../../domain/bargainOrder'
import { IBargainOrderRepo } from '../../../repos/bargainOrderRepo'
import { GetBargainOrderDto } from './getBargainOrderDto'


type Response = Either<AppError.UnexpectedError, Result<BargainOrder>>


export class GetBargainOrderUseCase implements UseCase<GetBargainOrderDto, Promise<Response>> {
  private bargainOrderRepo: IBargainOrderRepo

  constructor(
    bargainOrderRepo: IBargainOrderRepo) {
    this.bargainOrderRepo = bargainOrderRepo
  }


  public async execute(request: GetBargainOrderDto): Promise<Response> {
    try {
      const { bargainOrderId } = request
      const bargainOrder = await this.bargainOrderRepo.getById(bargainOrderId)
      return right(Result.ok<BargainOrder>(bargainOrder))
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
