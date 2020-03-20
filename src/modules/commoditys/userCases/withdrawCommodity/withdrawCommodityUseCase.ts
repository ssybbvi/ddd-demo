import { Either, Result, right, left } from '../../../../shared/core/Result'
import { AppError } from '../../../../shared/core/AppError'
import { UseCase } from '../../../../shared/core/UseCase'
import { ICommodityRepo } from '../../repos/iCommodityRepo'
import { WithdrawCommodityDto } from './withdrawCommodityDto'
import { WithdrawCommodityErrors } from './withdrawCommodityErrors'

type Response = Either<WithdrawCommodityErrors.CommodityNotFound|AppError.UnexpectedError | Result<any>, Result<void>>

export class WithdrawCommodityUseCase implements UseCase<WithdrawCommodityDto, Promise<Response>> {
  private commodityRepo: ICommodityRepo

  constructor(commodityRepo: ICommodityRepo) {
    this.commodityRepo = commodityRepo
  }

  public async execute(request: WithdrawCommodityDto): Promise<Response> {
    try {
      const { commodityId } = request

      const commodity = await this.commodityRepo.getById(commodityId)
      if(commodity==null){
        return left(new WithdrawCommodityErrors.CommodityNotFound())
      }

      commodity.withdraw()
      await this.commodityRepo.save(commodity)

      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
