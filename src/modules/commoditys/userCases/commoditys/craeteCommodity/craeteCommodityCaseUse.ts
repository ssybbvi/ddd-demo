import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { Commodity } from '../../../domain/commodity'
import { CreateCommodityDto } from './createCommodityDto'
import { ICommodityRepo } from '../../../repos/iCommodityRepo'
import { CommodityName } from '../../../domain/commodityName'
import { CommodityAmount } from '../../../domain/commodityAmount'
import { CommodityType } from '../../../domain/commodityType'

type Response = Either<AppError.UnexpectedError, Result<void>>

export class CreateCommodityUseCase implements UseCase<CreateCommodityDto, Promise<Response>> {
  private commodityRepo: ICommodityRepo

  constructor(commodityRepo: ICommodityRepo) {
    this.commodityRepo = commodityRepo
  }

  public async execute(request: CreateCommodityDto): Promise<Response> {
    try {
      const { name, amount, description, images, fakeAmount, sales, restrictedPurchaseQuantity, tags, imgesDescrptionList, limitedPurchasePerPerson, type } = request

      const commodityNameOrErrors = CommodityName.create({ name })
      if (commodityNameOrErrors.isFailure) {
        return left(commodityNameOrErrors)
      }

      const commdityAmountOrErrors = CommodityAmount.create({ amount })
      if (commdityAmountOrErrors.isFailure) {
        return left(commdityAmountOrErrors)
      }

      const commodityOrErrors = Commodity.create({
        name: commodityNameOrErrors.getValue(),
        amount: commdityAmountOrErrors.getValue(),
        description,
        images,
        fakeAmount,
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
