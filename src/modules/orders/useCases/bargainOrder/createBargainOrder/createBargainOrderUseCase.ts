import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { OrderAddress } from '../../../domain/orderAddress'
import { ICommodityRepo } from '../../../../commoditys/repos/iCommodityRepo'

import { CreateBargainOrderDto } from './createBargainOrderDto'
import { CreateBargainOrderErrors } from './createBargainOrderErrors'
import { BargainOrder } from '../../../domain/bargainOrder'
import { IBargainOrderRepo } from '../../../repos/bargainOrderRepo'


type Response = Either<
  CreateBargainOrderErrors.CommodityNotFoundError |
  CreateBargainOrderErrors.DotBuyRepeatOnceCommodityError |
  CreateBargainOrderErrors.OrderItemNotNullError |
  AppError.UnexpectedError, Result<BargainOrder>>


export class CreateBargainOrderUseCase implements UseCase<CreateBargainOrderDto, Promise<Response>> {
  private commodityRepo: ICommodityRepo
  private bargainOrderRepo: IBargainOrderRepo

  constructor(
    commodityRepo: ICommodityRepo,
    bargainOrderRepo: IBargainOrderRepo) {
    this.commodityRepo = commodityRepo
    this.bargainOrderRepo = bargainOrderRepo
  }


  public async execute(request: CreateBargainOrderDto): Promise<Response> {
    try {
      const {
        userId,
        commodityId,

        userName,
        provinceName,
        cityName,
        countyName,
        detailAddressInfo,
        nationalCode,
        telNumber,
      } = request

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

      const commodity = await this.commodityRepo.getById(commodityId)
      if (!commodity) {
        return left(new CreateBargainOrderErrors.CommodityNotFoundError(commodityId))
      }
      if (!commodity.isBargain()) {
        return left(new CreateBargainOrderErrors.NotBargainCommodityError())
      }

      const bargainOrderOrErrors = BargainOrder.create({
        userId,
        commodityId,
        name: commodity.name.value,
        price: commodity.price.value,
        address: orderAddressOrErrors.getValue()
      })
      if (bargainOrderOrErrors.isFailure) {
        return left(bargainOrderOrErrors)
      }

      const bargainOrder = bargainOrderOrErrors.getValue()
      bargainOrder.bargain(userId)
      await this.bargainOrderRepo.save(bargainOrder)

      return right(Result.ok<BargainOrder>(bargainOrder))
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }



}
