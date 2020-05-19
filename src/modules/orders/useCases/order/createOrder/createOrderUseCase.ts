import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { Order } from '../../../domain/order'
import { CreateOrderDto } from './createOrderDto'
import { IOrderRepo } from '../../../repos/orderRepo'

import { CommodityItem } from '../../../domain/commodityItem'
import { CreateOrderErrors } from './createOrderErrors'
import { DotBuyRepeatOnceCommodityError } from '../../../domain/orderUser'
import { CommodityItems } from '../../../domain/commodityItems'
import { NotFoundError } from '../../../../../shared/core/NotFoundError'
import { OrderAssertionService } from '../../../domain/service/assertionService'
import { AddressInfo } from '../../../domain/addressInfo'

type Response = Either<
  | NotFoundError
  | DotBuyRepeatOnceCommodityError
  | CreateOrderErrors.CommodityItemNotNull
  | Result<any>
  | AppError.UnexpectedError,
  Result<Order>
>

export class CreateOrderUseCase implements UseCase<CreateOrderDto, Promise<Response>> {
  private orderRepo: IOrderRepo
  private orderAssertionService: OrderAssertionService

  constructor(orderRepo: IOrderRepo, orderAssertionService: OrderAssertionService) {
    this.orderRepo = orderRepo
    this.orderAssertionService = orderAssertionService
  }

  public async execute(request: CreateOrderDto): Promise<Response> {
    try {
      const {
        userId,
        remark,

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

      // const buyOneceAssertioResult = await this.orderAssertionService.buyOneceAssertion(userId, commodityItemList)
      // if (buyOneceAssertioResult.isLeft()) {
      //   return left(buyOneceAssertioResult.value)
      // }

      const orderOrErrors = Order.create({
        userId: userId,
        remark: remark,
        addressInfo: addressInfoOrErrors.getValue(),
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
