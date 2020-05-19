import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { AddressInfo } from '../../../domain/addressInfo'

import { CreateBargainDto } from './createBargainDto'
import { CreateBargainErrors } from './createBargainErrors'
import { Bargain } from '../../../domain/bargain'
import { IBargainRepo } from '../../../repos/bargainRepo'
import { DeliveryInfo } from '../../../domain/deliveryInfo'
import { DotBuyRepeatOnceCommodityError } from '../../../domain/orderUser'
import { CommodityItem } from '../../../domain/commodityItem'
import { OrderAssertionService } from '../../../domain/service/assertionService'
import { CommodityItems } from '../../../domain/commodityItems'

type Response = Either<
  | CreateBargainErrors.CommodityNotFoundError
  | DotBuyRepeatOnceCommodityError
  | CreateBargainErrors.CommodityItemNotNullError
  | Result<any>
  | AppError.UnexpectedError,
  Result<Bargain>
>

export class CreateBargainUseCase implements UseCase<CreateBargainDto, Promise<Response>> {
  private orderAssertionService: OrderAssertionService
  private bargainRepo: IBargainRepo

  constructor(orderAssertionService: OrderAssertionService, bargainRepo: IBargainRepo) {
    this.orderAssertionService = orderAssertionService
    this.bargainRepo = bargainRepo
  }

  public async execute(request: CreateBargainDto): Promise<Response> {
    try {
      const {
        userId,
        commodityItems,

        userName,
        provinceName,
        cityName,
        countyName,
        detailAddressInfo,
        nationalCode,
        telNumber,
      } = request

      const addressInfoOrErrors = AddressInfo.create({
        userName: userName,
        provinceName: provinceName,
        cityName: cityName,
        countyName: countyName,
        detailAddressInfo: detailAddressInfo,
        nationalCode: nationalCode,
        telNumber: telNumber,
      })

      if (addressInfoOrErrors.isFailure) {
        return left(addressInfoOrErrors)
      }

      const assertionCommodityItemsResult = await this.orderAssertionService.assertionCommodityItems(commodityItems)
      const assertionCommodityItemsResultValue = assertionCommodityItemsResult.value
      if (assertionCommodityItemsResult.isLeft()) {
        return left(assertionCommodityItemsResultValue)
      }
      const commodityItemList = assertionCommodityItemsResultValue.getValue() as CommodityItem[]

      if (!commodityItemList.every((item) => item.isBargain())) {
        return left(new CreateBargainErrors.NotBargainCommodityError())
      }

      const bargainList = await this.bargainRepo.filter(userId)
      if (bargainList.some((item) => !item.finishAt)) {
        return left(new CreateBargainErrors.DotMultipleBargainActivitiesError())
      }

      const commodityItems1 = CommodityItems.create(commodityItemList)
      const bargainOrErrors = Bargain.create({
        userId,
        commodityItems: commodityItems1,
        addressInfo: addressInfoOrErrors.getValue(),
      })
      if (bargainOrErrors.isFailure) {
        return left(bargainOrErrors)
      }

      const particpantsCountByUserId = await this.bargainRepo.getParticpantsCountByUserId(userId)
      const weights = Math.pow(0.9, particpantsCountByUserId)

      const bargain = bargainOrErrors.getValue()
      bargain.bargain(userId, weights)
      await this.bargainRepo.save(bargain)

      return right(Result.ok<Bargain>(bargain))
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
