import { CommodityItem } from '../commodityItem'
import { left, right, Result, Either } from '../../../../shared/core/Result'
import { OrderUser, DotBuyRepeatOnceCommodityError } from '../orderUser'
import { GetOrderUserUseCase } from '../../useCases/orderUser/getOrderUser/getOrderUserUseCase'
import { AppError } from '../../../../shared/core/AppError'
import { CreateCommodityItemDto } from '../../useCases/order/createOrder/createOrderDto'
import { NotFoundError } from '../../../../shared/core/NotFoundError'
import { GetCommodityByIdUseCase } from '../../../commoditys/userCases/commoditys/getCommodityById/getCommodityByIdUseCase'
import { Commodity } from '../../../commoditys/domain/commodity'

export type BuyOneceAssertionResponse = Either<
  DotBuyRepeatOnceCommodityError | Result<OrderUser> | Result<CommodityItem> | Result<Commodity> | NotFoundError,
  Result<void>
>

export type CommodityItemsResponse = Either<
  AppError.UnexpectedError | Result<CommodityItem> | Result<Commodity> | NotFoundError,
  Result<CommodityItem[]>
>

export class OrderAssertionService {
  private getOrderUserUseCase: GetOrderUserUseCase
  private getCommodityByIdUseCase: GetCommodityByIdUseCase
  constructor(getOrderUserUseCase: GetOrderUserUseCase, getCommodityByIdUseCase: GetCommodityByIdUseCase) {
    this.getOrderUserUseCase = getOrderUserUseCase
    this.getCommodityByIdUseCase = getCommodityByIdUseCase
  }

  public async buyOneceAssertion(
    userId: string,
    commodityItemList: CommodityItem[]
  ): Promise<BuyOneceAssertionResponse> {
    const isCommodityItemHasBuyOnceeCommodity = commodityItemList.some((item) => item.commodityType == 'buyOnce')

    const getOrderUserUseCaseResult = await this.getOrderUserUseCase.execute({ userId })
    const getOrderUserUseCaseResultValue = getOrderUserUseCaseResult.value
    if (getOrderUserUseCaseResult.isLeft()) {
      return left(getOrderUserUseCaseResultValue)
    }
    const orderUser = getOrderUserUseCaseResultValue.getValue() as OrderUser
    const isAllowBuyOnceCommodity = orderUser.isAllowBuyOnceCommodity

    if (!isAllowBuyOnceCommodity && isCommodityItemHasBuyOnceeCommodity) {
      return left(new DotBuyRepeatOnceCommodityError())
    }
    return right(Result.ok<void>())
  }

  public async assertionCommodityItems(commodityItems: CreateCommodityItemDto[]): Promise<CommodityItemsResponse> {
    if (!!commodityItems === false || commodityItems.length === 0) {
      return left(new NotFoundError('没有该商品'))
    }

    let commodityItemList: CommodityItem[] = []
    for (let item of commodityItems) {
      let getCommodityByIdUseCaseResult = await this.getCommodityByIdUseCase.execute({ commodityId: item.commodityId })
      let getCommodityByIdUseCaseResultValue = getCommodityByIdUseCaseResult.value
      if (getCommodityByIdUseCaseResult.isLeft()) {
        return left(getCommodityByIdUseCaseResultValue)
      }
      const commodity = getCommodityByIdUseCaseResultValue.getValue() as Commodity
      const sku = commodity.skus.getItems().find((findItem) => findItem.id.toString() === item.skuId)
      if (!sku) {
        return left(new NotFoundError('无此skuId'))
      }

      let commodityItemOrErrors = CommodityItem.create({
        name: commodity.name.value,
        amount: sku.price,
        commodityId: item.commodityId,
        commodityType: commodity.type,
        skuId: item.skuId,
        specifications: sku.name,
        strategyTags: commodity.strategyTags,
      })

      if (commodityItemOrErrors.isFailure) {
        return left(commodityItemOrErrors)
      }

      commodityItemList.push(commodityItemOrErrors.getValue())
    }

    return right(Result.ok<CommodityItem[]>(commodityItemList))
  }
}
