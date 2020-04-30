import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { ICommodityRepo } from '../../../repos/iCommodityRepo'
import { IEditCommodityDto } from './editCommodityDto'
import { CommodityName } from '../../../domain/commodityName'
import { CommodityAmount } from '../../../domain/commodityAmount'
import { CommodityType } from '../../../domain/commodityType'

type Response = Either<AppError.UnexpectedError, Result<void>>

export class EditCommodityUseCase implements UseCase<IEditCommodityDto, Promise<Response>> {
  private commodityRepo: ICommodityRepo

  constructor(commodityRepo: ICommodityRepo) {
    this.commodityRepo = commodityRepo
  }

  public async execute(request: IEditCommodityDto): Promise<Response> {
    try {
      const { _id, name, amount, description, images, fakeAmount, restrictedPurchaseQuantity, tags, imgesDescrptionList, type } = request

      const commodity = await this.commodityRepo.getById(_id)

      const commodityNameOrErrors = CommodityName.create({ name })
      if (commodityNameOrErrors.isFailure) {
        return left(commodityNameOrErrors)
      }

      const commdityAmountOrErrors = CommodityAmount.create({ amount })
      if (commdityAmountOrErrors.isFailure) {
        return left(commdityAmountOrErrors)
      }

      commodity.updateName(commodityNameOrErrors.getValue())
      commodity.updateAmount(commdityAmountOrErrors.getValue())
      commodity.updateDescrption(description)
      commodity.updateFakeAmount(fakeAmount)
      commodity.updateImages(images)
      commodity.updateTags(tags)
      commodity.updateRestrictedPurchaseQuantity(restrictedPurchaseQuantity)
      commodity.updateImgesDescrptionList(imgesDescrptionList)
      commodity.updateType(type as CommodityType)

      await this.commodityRepo.save(commodity)
      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
