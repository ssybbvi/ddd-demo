import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { Commodity } from '../../../domain/commodity'
import { ICommodityRepo } from '../../../repos/iCommodityRepo'
import { IGetCommodityListBySkuIdsDto } from './getCommodityListBySkuIdsDto'

type Response = Either<AppError.UnexpectedError, Result<Commodity[]>>

export class GetCommodityListBySkuIdsUseCase implements UseCase<IGetCommodityListBySkuIdsDto, Promise<Response>> {
  private commodityRepo: ICommodityRepo

  constructor(commodityRepo: ICommodityRepo) {
    this.commodityRepo = commodityRepo
  }

  public async execute(request: IGetCommodityListBySkuIdsDto): Promise<Response> {
    try {
      const { skuIds } = request

      const list = await this.commodityRepo.filterBySkuIds(skuIds)

      return right(Result.ok<Commodity[]>(list))
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
