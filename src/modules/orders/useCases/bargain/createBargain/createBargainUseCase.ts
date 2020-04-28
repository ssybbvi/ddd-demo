import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { OrderAddress } from '../../../domain/orderAddress'
import { ICommodityRepo } from '../../../../commoditys/repos/iCommodityRepo'

import { CreateBargainDto } from './createBargainDto'
import { CreateBargainErrors } from './createBargainErrors'
import { Bargain } from '../../../domain/bargain'
import { IBargainRepo } from '../../../repos/bargainRepo'
import { DeliveryInfo } from '../../../domain/deliveryInfo'


type Response = Either<
  CreateBargainErrors.CommodityNotFoundError |
  CreateBargainErrors.DotBuyRepeatOnceCommodityError |
  CreateBargainErrors.CommodityItemNotNullError |
  AppError.UnexpectedError, Result<Bargain>>

type AddressResponse = Either<AppError.UnexpectedError, Result<OrderAddress>>


export class CreateBargainUseCase implements UseCase<CreateBargainDto, Promise<Response>> {
  private commodityRepo: ICommodityRepo
  private bargainRepo: IBargainRepo

  constructor(
    commodityRepo: ICommodityRepo,
    bargainRepo: IBargainRepo) {
    this.commodityRepo = commodityRepo
    this.bargainRepo = bargainRepo
  }

  private async assertionAddress({ userName,
    provinceName,
    cityName,
    countyName,
    detailAddressInfo,
    nationalCode,
    telNumber }): Promise<AddressResponse> {

    const orderAddressOrErrors = OrderAddress.create({
      userName: userName,
      provinceName: provinceName,
      cityName: cityName,
      countyName: countyName,
      detailAddressInfo: detailAddressInfo,
      nationalCode: nationalCode,
      telNumber: telNumber,
    })

    if (orderAddressOrErrors.isFailure) {
      return left(orderAddressOrErrors)
    }

    return right(Result.ok<OrderAddress>(orderAddressOrErrors.getValue()))
  }

  public async execute(request: CreateBargainDto): Promise<Response> {
    try {
      const {
        userId,
        commodityId,
      } = request


      const addressResult = await this.assertionAddress(request)
      if (addressResult.isLeft()) {
        return left(addressResult)
      }

      const commodity = await this.commodityRepo.getById(commodityId)
      if (!commodity) {
        return left(new CreateBargainErrors.CommodityNotFoundError(commodityId))
      }
      if (!commodity.isBargain()) {
        return left(new CreateBargainErrors.NotBargainCommodityError())
      }

      const bargainList = await this.bargainRepo.filter(userId)
      if (bargainList.some(item => !item.finishAt)) {
        return left(new CreateBargainErrors.DotMultipleBargainActivitiesError())
      }


      const deliveryInfoOrErrors = DeliveryInfo.create({
        address: addressResult.value.getValue()
      })

      if (deliveryInfoOrErrors.isFailure) {
        return left(deliveryInfoOrErrors)
      }

      const bargainOrErrors = Bargain.create({
        userId,
        commodityId,
        name: commodity.name.value,
        price: commodity.price.value,
        deliveryInfo: deliveryInfoOrErrors.getValue()
      })
      if (bargainOrErrors.isFailure) {
        return left(bargainOrErrors)
      }

      const bargain = bargainOrErrors.getValue()
      bargain.bargain(userId)
      await this.bargainRepo.save(bargain)


      return right(Result.ok<Bargain>(bargain))
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }



}
