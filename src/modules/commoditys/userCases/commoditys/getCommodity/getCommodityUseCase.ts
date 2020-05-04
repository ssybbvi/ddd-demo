import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { Commodity } from '../../../domain/commodity'
import { ICommodityRepo } from '../../../repos/iCommodityRepo'
import { GetCommodityDto } from './getCommodityDto'
import { CommodityDto } from '../../../dtos/commodityDto'
import { CommodityMap } from '../../../mappers/commodityMap'

type Response = Either<AppError.UnexpectedError | Result<any>, Result<Commodity[]>>

export class GetCommodityUseCase implements UseCase<GetCommodityDto, Promise<Response>> {
  private commodityRepo: ICommodityRepo

  constructor(commodityRepo: ICommodityRepo) {
    this.commodityRepo = commodityRepo
  }

  public async execute(request: GetCommodityDto): Promise<Response> {
    try {
      const { name, tag } = request
      console.log(name, tag)
      const list = await this.commodityRepo.filter(name, tag)
      return right(Result.ok<Commodity[]>(list))
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
