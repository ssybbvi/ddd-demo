import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { Commodity } from '../../../domain/commodity'
import { CreateCommodityDto } from './createCommodityDto'
import { ICommodityRepo } from '../../../repos/iCommodityRepo'
import { CommodityName } from '../../../domain/commodityName'
import { CommodityPrice } from '../../../domain/commodityPrice'
import { CommodityType } from '../../../domain/commodityType'

type Response = Either<AppError.UnexpectedError | Result<any>, Result<void>>

export class CreateCommodityUseCase implements UseCase<CreateCommodityDto, Promise<Response>> {
  private commodityRepo: ICommodityRepo

  constructor(commodityRepo: ICommodityRepo) {
    this.commodityRepo = commodityRepo
  }

  public async execute(request: CreateCommodityDto): Promise<Response> {
    try {
      const { name, price, descrption, images, fakePrice, sales, restrictedPurchaseQuantity, tags, imgesDescrptionList, limitedPurchasePerPerson, type } = request

      const commodityNameOrErrors = CommodityName.create({ name })
      if (commodityNameOrErrors.isFailure) {
        return left(commodityNameOrErrors)
      }

      const commdityPriceOrErrors = CommodityPrice.create({ price })
      if (commdityPriceOrErrors.isFailure) {
        return left(commdityPriceOrErrors)
      }

      const commodityOrErrors = Commodity.create({
        name: commodityNameOrErrors.getValue(),
        price: commdityPriceOrErrors.getValue(),
        descrption,
        images,
        fakePrice,
        sales,
        restrictedPurchaseQuantity,
        limitedPurchasePerPerson,
        tags,
        imgesDescrptionList,
        type: type as CommodityType
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
