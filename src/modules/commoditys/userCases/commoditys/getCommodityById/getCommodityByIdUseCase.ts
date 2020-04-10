import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { Commodity } from '../../../domain/commodity'
import { ICommodityRepo } from '../../../repos/iCommodityRepo'
import { GetCommodityByIdDto } from './getCommodityByIdDto'
import { GetCommodityErrors } from './getCommodityErrors'

type Response = Either<GetCommodityErrors.CommodityNotFound | AppError.UnexpectedError | Result<any>, Result<Commodity>>

export class GetCommodityByIdUseCase implements UseCase<GetCommodityByIdDto, Promise<Response>> {
  private commodityRepo: ICommodityRepo

  constructor(commodityRepo: ICommodityRepo) {
    this.commodityRepo = commodityRepo
  }

  public async execute(request: GetCommodityByIdDto): Promise<Response> {
    try {
      const { commodityId } = request

      console.log("this.commodityRepo.getById(commodityId)", commodityId)
      const commodity = await this.commodityRepo.getById(commodityId)
      console.log("xxxxxx", commodity)
      if (commodity == null) {
        return left(new GetCommodityErrors.CommodityNotFound())
      }

      return right(Result.ok<Commodity>(commodity))
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
