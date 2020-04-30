import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { Commodity } from '../../../domain/commodity'
import { ICommodityRepo } from '../../../repos/iCommodityRepo'
import { GetCommodityByIdDto } from './getCommodityByIdDto'
import { NotFoundError } from '../../../../../shared/core/NotFoundError'

type Response = Either<NotFoundError, Result<Commodity>>

export class GetCommodityByIdUseCase implements UseCase<GetCommodityByIdDto, Promise<Response>> {
  private commodityRepo: ICommodityRepo

  constructor(commodityRepo: ICommodityRepo) {
    this.commodityRepo = commodityRepo
  }

  public async execute(request: GetCommodityByIdDto): Promise<Response> {
    try {
      const { commodityId } = request

      const commodity = await this.commodityRepo.getById(commodityId)
      if (commodity == null) {
        return left(new NotFoundError())
      }

      return right(Result.ok<Commodity>(commodity))
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
