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
import { OrderUser, DotBuyRepeatOnceCommodityError } from '../../../domain/orderUser'
import { CommodityItems } from '../../../domain/commodityItems'
import { DeliveryInfo } from '../../../domain/deliveryInfo'
import { OrderAddress } from '../../../domain/orderAddress'
import { NotFoundError } from '../../../../../shared/core/NotFoundError'
import { OrderAssertionService } from '../../../domain/service/assertionService'


type Response = Either<
  NotFoundError
  | DotBuyRepeatOnceCommodityError
  | CreateOrderErrors.CommodityItemNotNull
  | Result<any>
  | AppError.UnexpectedError, Result<Order>>



export class CreateOrderUseCase implements UseCase<CreateOrderDto, Promise<Response>> {
  private orderRepo: IOrderRepo
  private orderAssertionService: OrderAssertionService

  constructor(
    orderRepo: IOrderRepo,
    orderAssertionService: OrderAssertionService) {
    this.orderRepo = orderRepo
    this.orderAssertionService = orderAssertionService
  }


  public async execute(request: CreateOrderDto): Promise<Response> {
    try {
      const {
        userId,
        remark,

        commodityItems
      } = request

      const addressResult = await this.orderAssertionService.assertionAddress(request)
      if (addressResult.isLeft()) {
        return left(addressResult)
      }

      const assertionCommodityItemsResult = await this.orderAssertionService.assertionCommodityItems(commodityItems)
      const assertionCommodityItemsResultValue = assertionCommodityItemsResult.value
      if (assertionCommodityItemsResult.isLeft()) {
        return left(assertionCommodityItemsResultValue)
      }
      const commodityItemList = assertionCommodityItemsResultValue.getValue() as CommodityItem[]

      // const buyOneceAssertioResult = await this.orderAssertionService.buyOneceAssertion(userId, commodityItemList)
      // if (buyOneceAssertioResult.isLeft()) {
      //   return left(buyOneceAssertioResult.value)
      // }

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
