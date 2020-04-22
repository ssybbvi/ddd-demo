import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { BargainOrder } from '../../../domain/bargainOrder'
import { IBargainOrderRepo } from '../../../repos/bargainOrderRepo'
import { GetBargainOrderListDto } from './getBargainOrderListDto'


type Response = Either<AppError.UnexpectedError, Result<BargainOrder[]>>


export class GetBargainOrderListUseCase implements UseCase<GetBargainOrderListDto, Promise<Response>> {
  private bargainOrderRepo: IBargainOrderRepo

  constructor(
    bargainOrderRepo: IBargainOrderRepo) {
    this.bargainOrderRepo = bargainOrderRepo
  }


  public async execute(request: GetBargainOrderListDto): Promise<Response> {
    try {
      const { } = request
      const bargainOrderList = await this.bargainOrderRepo.filter()
      return right(Result.ok<BargainOrder[]>(bargainOrderList))
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
