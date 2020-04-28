import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { Order } from '../../../domain/order'
import { CreateOrderDto } from './createOrderDto'
import { IOrderRepo } from '../../../repos/orderRepo'
import { ICommodityRepo } from '../../../../commoditys/repos/iCommodityRepo'

import { CommodityItem } from '../../../domain/commodityItem'
import { CreateOrderErrors } from './createOrderErrors'
import { GetOrderUserUseCase } from '../../orderUser/getOrderUser/getOrderUserUseCase'
import { OrderUser } from '../../../domain/orderUser'
import { CommodityItems } from '../../../domain/commodityItems'
import { DeliveryInfo } from '../../../domain/deliveryInfo'
import { OrderAddress } from '../../../domain/orderAddress'
import { NotFoundError } from '../../../../../shared/core/NotFoundError'


type Response = Either<
  NotFoundError
  | CreateOrderErrors.DotBuyRepeatOnceCommodity
  | CreateOrderErrors.CommodityItemNotNull
  | AppError.UnexpectedError, Result<Order>>

type BuyOneceAssertionResponse = Either<
  CreateOrderErrors.DotBuyRepeatOnceCommodity
  | CreateOrderErrors.CommodityItemNotNull
  | AppError.UnexpectedError, Result<void>>

type AddressResponse = Either<AppError.UnexpectedError, Result<OrderAddress>>

export class CreateOrderUseCase implements UseCase<CreateOrderDto, Promise<Response>> {
  private orderRepo: IOrderRepo
  private commodityRepo: ICommodityRepo
  private getOrderUserUseCase: GetOrderUserUseCase

  constructor(
    orderRepo: IOrderRepo,
    commodityRepo: ICommodityRepo,
    getOrderUserUseCase: GetOrderUserUseCase) {
    this.orderRepo = orderRepo
    this.commodityRepo = commodityRepo
    this.getOrderUserUseCase = getOrderUserUseCase
  }

  private async buyOneceAssertio(userId: string, commodityItemList: CommodityItem[]): Promise<BuyOneceAssertionResponse> {
    const isCommodityItemHasBuyOnceeCommodity = commodityItemList.some(item => item.commodityType == 'buyOnce')

    const getOrderUserUseCaseResult = await this.getOrderUserUseCase.execute({ userId })
    const getOrderUserUseCaseResultValue = getOrderUserUseCaseResult.value
    if (getOrderUserUseCaseResult.isLeft()) {
      return left(getOrderUserUseCaseResultValue)
    }
    const orderUser = getOrderUserUseCaseResultValue.getValue() as OrderUser
    const isAllowBuyOnceCommodity = orderUser.isAllowBuyOnceCommodity

    if (!isAllowBuyOnceCommodity && isCommodityItemHasBuyOnceeCommodity) {
      return left(new CreateOrderErrors.DotBuyRepeatOnceCommodity())
    }
    return right(Result.ok<void>())
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


  public async execute(request: CreateOrderDto): Promise<Response> {
    try {
      const {
        userId,
        remark,

        commodityItems
      } = request

      const addressResult = await this.assertionAddress(request)
      if (addressResult.isLeft()) {
        return left(addressResult)
      }

      if (!!commodityItems === false || commodityItems.length === 0) {
        return left(new CreateOrderErrors.CommodityItemNotNull())
      }

      let commodityItemList: CommodityItem[] = []
      for (let item of commodityItems) {

        let commodity = await this.commodityRepo.getById(item.commodityId)
        if (!!commodity === false) {
          return left(new CreateOrderErrors.CommodityNotFound(item.commodityId))
        }

        let commodityItemOrErrors = CommodityItem.create({
          name: commodity.name.value,
          price: commodity.price.value,
          image: commodity.images && commodity.images.length ? commodity.images[0] : "",
          commodityId: item.commodityId,
          commodityType: commodity.type
        })

        if (commodityItemOrErrors.isFailure) {
          return left(commodityItemOrErrors)
        }
        commodityItemList.push(commodityItemOrErrors.getValue())
      }


      const buyOneceAssertioResult = await this.buyOneceAssertio(userId, commodityItemList)
      if (buyOneceAssertioResult.isLeft()) {
        return left(buyOneceAssertioResult.value)
      }

      const deliveryInfoResult = DeliveryInfo.create({
        address: addressResult.value.getValue()
      })

      if (deliveryInfoResult.isFailure) {
        return left(deliveryInfoResult)
      }

      const orderOrErrors = Order.create({
        userId: userId,
        remark: remark,
        deliveryInfo: deliveryInfoResult.getValue(),
        commodityItems: CommodityItems.create(commodityItemList),
      })

      if (orderOrErrors.isFailure) {
        return left(orderOrErrors)
      }

      await this.orderRepo.save(orderOrErrors.getValue())

      return right(Result.ok<Order>(orderOrErrors.getValue()))
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
