import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { Order } from '../../../domain/order'
import { CreateOrderDto } from './createOrderDto'
import { OrderAddress } from '../../../domain/orderAddress'
import { IOrderRepo } from '../../../repos/orderRepo'
import { ICommodityRepo } from '../../../../commoditys/repos/iCommodityRepo'

import { OrderItem } from '../../../domain/orderItem'
import { CreateOrderErrors } from './createOrderErrors'
import { GetOrderUserUseCase } from '../../orderUser/getOrderUser/getOrderUserUseCase'
import { OrderUser } from '../../../domain/orderUser'


type Response = Either<
  CreateOrderErrors.CommodityNotFound
  | CreateOrderErrors.DotBuyRepeatOnceCommodity
  | CreateOrderErrors.OrderItemNotNull
  | AppError.UnexpectedError | Result<any>, Result<Order>>

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

  public async execute(request: CreateOrderDto): Promise<Response> {
    try {
      const {
        userId,
        remark,

        userName,
        provinceName,
        cityName,
        countyName,
        detailAddressInfo,
        nationalCode,
        telNumber,

        items
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

      if (!!items === false || items.length === 0) {
        return left(new CreateOrderErrors.OrderItemNotNull())
      }


      let orderItemList: OrderItem[] = []
      for (let item of items) {

        let commodity = await this.commodityRepo.getById(item.commodityId)
        if (!!commodity === false) {
          return left(new CreateOrderErrors.CommodityNotFound(item.commodityId))
        }

        let orderItemOrErrors = OrderItem.create({
          name: commodity.name.value,
          price: commodity.price.value,
          image: commodity.images && commodity.images.length ? commodity.images[0] : "",
          commodityId: item.commodityId,
          commodityType: commodity.type
        })

        if (orderItemOrErrors.isFailure) {
          return left(orderItemOrErrors)
        }
        orderItemList.push(orderItemOrErrors.getValue())
      }
      const isOrderItemHasBuyOnceeCommodity = orderItemList.some(item => item.commodityType == 'buyOnce')


      const getOrderUserUseCaseResult = await this.getOrderUserUseCase.execute({ userId: userId })
      const getOrderUserUseCaseResultValue = getOrderUserUseCaseResult.value
      if (getOrderUserUseCaseResult.isLeft()) {
        return left(getOrderUserUseCaseResultValue)
      }
      const orderUser = getOrderUserUseCaseResultValue.getValue() as OrderUser
      const isAllowBuyOnceCommodity = orderUser.isAllowBuyOnceCommodity

      if (!isAllowBuyOnceCommodity && isOrderItemHasBuyOnceeCommodity) {
        return left(new CreateOrderErrors.DotBuyRepeatOnceCommodity())
      }

      const orderOrErrors = Order.create({
        userId: userId,
        status: 'unpaid',
        remark: remark,
        orderAddress: orderAddressOrErrors.getValue(),
        items: orderItemList,
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
