import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { ICommodityRepo } from '../../../repos/iCommodityRepo'
import { IEditCommodityDto } from './editCommodityDto'
import { CommodityName } from '../../../domain/commodityName'
import { CommodityPrice } from '../../../domain/commodityPrice'

type Response = Either<AppError.UnexpectedError | Result<any>, Result<void>>

export class EditCommodityUseCase implements UseCase<IEditCommodityDto, Promise<Response>> {
  private commodityRepo: ICommodityRepo

  constructor(commodityRepo: ICommodityRepo) {
    this.commodityRepo = commodityRepo
  }

  public async execute(request: IEditCommodityDto): Promise<Response> {
    try {
      const { _id, name, price, descrption, images, fakePrice, restrictedPurchaseQuantity, tags, imgesDescrptionList } = request

      const commodity = await this.commodityRepo.getById(_id)

      const commodityNameOrErrors = CommodityName.create({ name })
      if (commodityNameOrErrors.isFailure) {
        return left(commodityNameOrErrors)
      }

      const commdityPriceOrErrors = CommodityPrice.create({ price })
      if (commdityPriceOrErrors.isFailure) {
        return left(commdityPriceOrErrors)
      }

      commodity.updateName(commodityNameOrErrors.getValue())
      commodity.updatePrice(commdityPriceOrErrors.getValue())
      commodity.updateDescrption(descrption)
      commodity.updateFakePrice(fakePrice)
      commodity.updateImages(images)
      commodity.updateTags(tags)
      commodity.updateRestrictedPurchaseQuantity(restrictedPurchaseQuantity)
      commodity.updateImgesDescrptionList(imgesDescrptionList)

      await this.commodityRepo.save(commodity)
      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
