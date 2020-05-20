import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { Commodity } from '../../../domain/commodity'
import { CreateCommodityDto } from './createCommodityDto'
import { ICommodityRepo } from '../../../repos/iCommodityRepo'
import { CommodityName } from '../../../domain/commodityName'
import { CommodityAmount } from '../../../domain/commodityAmount'
import { CommodityType } from '../../../domain/commodityType'
import { Sku } from '../../../domain/sku'
import { SkuMap } from '../../../mappers/skuMap'
import { Skus } from '../../../domain/skus'

type Response = Either<AppError.UnexpectedError | Result<any>, Result<void>>

export class CreateCommodityUseCase implements UseCase<CreateCommodityDto, Promise<Response>> {
  private commodityRepo: ICommodityRepo

  constructor(commodityRepo: ICommodityRepo) {
    this.commodityRepo = commodityRepo
  }

  public async execute(request: CreateCommodityDto): Promise<Response> {
    try {
      const {
        name,
        amount,
        description,
        images,
        fakeAmount,
        sales,
        restrictedPurchaseQuantity,
        tags,
        imgesDescrptionList,
        limitedPurchasePerPerson,
        type,
        strategyTags,
        categoryId,
        skus,
      } = request

      const commodityNameOrErrors = CommodityName.create({ name })
      if (commodityNameOrErrors.isFailure) {
        return left(commodityNameOrErrors)
      }

      const commdityAmountOrErrors = CommodityAmount.create({ amount })
      if (commdityAmountOrErrors.isFailure) {
        return left(commdityAmountOrErrors)
      }

      const skuList = skus.map((item) => {
        return SkuMap.toDomain(item)
      })
      const skusDomian = Skus.create(skuList)

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
        type: type as CommodityType,
        strategyTags,
        categoryId,
        skus: skusDomian,
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
