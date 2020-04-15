import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { ICommodityRepo } from '../../../repos/iCommodityRepo'
import { SaleCommodityDto } from './saleCommodityDto'
import { SaleCommodityErrors } from './saleCommodityErrors'

type Response = Either<SaleCommodityErrors.CommodityNotFound | AppError.UnexpectedError, Result<void>>

export class SaleCommodityUseCase implements UseCase<SaleCommodityDto, Promise<Response>> {
  private commodityRepo: ICommodityRepo

  constructor(commodityRepo: ICommodityRepo) {
    this.commodityRepo = commodityRepo
  }

  public async execute(request: SaleCommodityDto): Promise<Response> {
    try {
      const { commodityId } = request

      const commodity = await this.commodityRepo.getById(commodityId)
      if (commodity == null) {
        return left(new SaleCommodityErrors.CommodityNotFound())
      }

      commodity.sale()
      await this.commodityRepo.save(commodity)

      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
