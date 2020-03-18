import { Either, Result, right, left } from '../../../../shared/core/Result'
import { AppError } from '../../../../shared/core/AppError'
import { UseCase } from '../../../../shared/core/UseCase'
import { Commodity } from '../../domain/commodity'
import { CreateCommodityDto } from './createCommodityDto'
import { ICommodityRepo } from '../../repos/iCommodityRepo'

type Response = Either<AppError.UnexpectedError | Result<any>, Result<void>>

export class CreateCommodityUseCase implements UseCase<CreateCommodityDto, Promise<Response>> {
  private commodityRepo: ICommodityRepo

  constructor(commodityRepo: ICommodityRepo) {
    this.commodityRepo = commodityRepo
  }

  public async execute(request: CreateCommodityDto): Promise<Response> {
    try {
      const { name, price, descrption, images, fakePrice, sales, restrictedPurchaseQuantity, tags } = request

      const commodityOrErrors = Commodity.create({
        name,
        price,
        descrption,
        images,
        fakePrice,
        sales,
        restrictedPurchaseQuantity,
        tags
      })

      if (commodityOrErrors.isFailure) {
        return left(commodityOrErrors)
      }

      await this.commodityRepo.save(commodityOrErrors.getValue())

      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
