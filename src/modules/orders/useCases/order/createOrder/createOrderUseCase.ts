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
import { GetActivityRewardUseCase } from '../../../../market/useCases/avtitvtys/getActivityReward/getActivityRewardUseCase'
import { Strategys } from '../../../../market/domain/strategys'

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
  private getActivityRewardUseCase: GetActivityRewardUseCase

  constructor(
    orderRepo: IOrderRepo,
    orderAssertionService: OrderAssertionService,
    getActivityRewardUseCase: GetActivityRewardUseCase
  ) {
    this.orderRepo = orderRepo
    this.orderAssertionService = orderAssertionService
    this.getActivityRewardUseCase = getActivityRewardUseCase
  }

  public async execute(request: CreateOrderDto): Promise<Response> {
    try {
      const {
        userId,
        remark,

        commodityItemDtoList,

        userName,
        provinceName,
        cityName,
        countyName,
        detailAddressInfo,
        nationalCode,
        telNumber,

        couponId,
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

      const assertionCommodityItemsResult = await this.orderAssertionService.assertionCommodityItems(
        commodityItemDtoList
      )
      if (assertionCommodityItemsResult.isLeft()) {
        return left(assertionCommodityItemsResult.value)
      }
      const commodityItemList = assertionCommodityItemsResult.value.getValue() as CommodityItem[]
      const commodityItems = CommodityItems.create(commodityItemList)

      // const buyOneceAssertioResult = await this.orderAssertionService.buyOneceAssertion(userId, commodityItemList)
      // if (buyOneceAssertioResult.isLeft()) {
      //   return left(buyOneceAssertioResult.value)
      // }

      const getActivityRewardUseCaseResult = await this.getActivityRewardUseCase.execute({
        couponId: couponId,
        strategyCommodityDtoList: commodityItemDtoList,
        userId: userId,
      })

      if (getActivityRewardUseCaseResult.isLeft()) {
        return left(getActivityRewardUseCaseResult.value)
      }

      const strategyList = getActivityRewardUseCaseResult.value.getValue()

      const orderOrErrors = Order.create({
        userId: userId,
        remark: remark,
        addressInfo: addressInfoOrErrors.getValue(),
        commodityItems: commodityItems,
        strategys: Strategys.create(strategyList),
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
