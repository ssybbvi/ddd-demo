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
import { IAddressUserRepo } from '../../../repos/addressUserRepo'
import { GetAddressUserListUseCase } from '../../addressUser/getAddressUserList/getAddressUserListUseCase'
import { AddressUser } from '../../../domain/addressUser'
import { DeliveryInfo } from '../../../domain/deliveryInfo'

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
  private getAddressUserListUseCase: GetAddressUserListUseCase

  constructor(
    orderRepo: IOrderRepo,
    orderAssertionService: OrderAssertionService,
    getActivityRewardUseCase: GetActivityRewardUseCase,
    getAddressUserListUseCase: GetAddressUserListUseCase
  ) {
    this.orderRepo = orderRepo
    this.orderAssertionService = orderAssertionService
    this.getActivityRewardUseCase = getActivityRewardUseCase
    this.getAddressUserListUseCase = getAddressUserListUseCase
  }

  public async execute(request: CreateOrderDto): Promise<Response> {
    try {
      const {
        userId,
        remark,

        commodityItemDtoList,

        deliveryInfoType,

        couponId,
      } = request

      let address: AddressInfo = null
      let deliveryInfoOrError = DeliveryInfo.create({ type: deliveryInfoType })
      if (deliveryInfoOrError.isFailure) {
        return left(deliveryInfoOrError)
      }

      if (deliveryInfoType === 'express') {
        const getAddressUserListUseCaseResult = await this.getAddressUserListUseCase.execute({ userId })
        if (getAddressUserListUseCaseResult.isLeft()) {
          return left(getAddressUserListUseCaseResult.value)
        }

        const addressUserList = getAddressUserListUseCaseResult.value.getValue() as AddressUser[]
        const addressUser = addressUserList.find((item) => item.isDefault)
        if (!addressUser) {
          return left(new NotFoundError('没有默认的发货地址'))
        }
        address = addressUser.addressInfo
      } else if (deliveryInfoType === 'self-fetch') {
      } else {
        return left(new NotFoundError('配送方式不能为空'))
      }

      const assertionCommodityItemsResult = await this.orderAssertionService.assertionCommodityItems(
        commodityItemDtoList
      )
      if (assertionCommodityItemsResult.isLeft()) {
        return left(assertionCommodityItemsResult.value)
      }
      const commodityItemList = assertionCommodityItemsResult.value.getValue() as CommodityItem[]
      const commodityItems = CommodityItems.create(commodityItemList)

      const buyOneceAssertioResult = await this.orderAssertionService.buyOneceAssertion(userId, commodityItemList)
      if (buyOneceAssertioResult.isLeft()) {
        return left(buyOneceAssertioResult.value)
      }

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
        couponId: couponId,
        userId: userId,
        remark: remark,
        commodityItems: commodityItems,
        addressInfo: address,
        deliveryInfo: deliveryInfoOrError.getValue(),
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
