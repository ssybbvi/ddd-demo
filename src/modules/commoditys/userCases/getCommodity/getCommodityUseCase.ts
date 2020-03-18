import { Either, Result, right, left } from '../../../../shared/core/Result'
import { AppError } from '../../../../shared/core/AppError'
import { UseCase } from '../../../../shared/core/UseCase'
import { Commodity } from '../../domain/commodity'
import { ICommodityRepo } from '../../repos/iCommodityRepo'
import { GetCommodityDto } from './getCommodityDto'
import { CommodityDto } from '../../dtos/commodityDto'
import { CommodityMap } from '../../mappers/CommodityMap'

type Response = Either<AppError.UnexpectedError | Result<any>, Result<CommodityDto[]>>

export class GetCommodityUseCase implements UseCase<GetCommodityDto, Promise<Response>> {
  private commodityRepo: ICommodityRepo

  constructor(commodityRepo: ICommodityRepo) {
    this.commodityRepo = commodityRepo
  }

  public async execute(request: GetCommodityDto): Promise<Response> {
    try {
      const { name, tag } = request

      const list = await this.commodityRepo.filter()

      const dtoList = list.map(item => CommodityMap.toDTO(item))

      return right(Result.ok<CommodityDto[]>(dtoList))
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
