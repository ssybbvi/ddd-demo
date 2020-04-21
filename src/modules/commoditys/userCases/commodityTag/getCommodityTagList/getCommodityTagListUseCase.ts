import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { ICommodityTagRepo } from '../../../repos/iCommodityTagRepo'

import { CommodityTag } from '../../../domain/commodityTag'
import { GetCommodityTagListDto } from './getCommodityTagListDto'

type Response = Either<AppError.UnexpectedError, Result<CommodityTag[]>>

export class GetCommodityTagListUseCase implements UseCase<GetCommodityTagListDto, Promise<Response>> {
  private commodityTagRepo: ICommodityTagRepo

  constructor(commodityTagRepo: ICommodityTagRepo) {
    this.commodityTagRepo = commodityTagRepo
  }

  public async execute(request: GetCommodityTagListDto): Promise<Response> {
    try {
      const { } = request

      const commodityTagList = await this.commodityTagRepo.filter()
      return right(Result.ok<CommodityTag[]>(commodityTagList))
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
