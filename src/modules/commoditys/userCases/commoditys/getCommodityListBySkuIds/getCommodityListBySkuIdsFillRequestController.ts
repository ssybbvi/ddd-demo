import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { CommodityMap } from '../../../mappers/commodityMap'
import { GetCommodityListBySkuIdsUseCase } from './getCommodityListBySkuIdsUseCase'
import { IGetCommodityListBySkuIdsDto } from './getCommodityListBySkuIdsDto'
import { IGetCommodiityListBySkuIdsFillRequestDto } from './getCommodiityListBySkuIdsFillRequestDto'
import { NotFoundError } from '../../../../../shared/core/NotFoundError'

export class GetCommodityListBySkuIdsFillRequestController extends BaseController {
  private useCase: GetCommodityListBySkuIdsUseCase

  constructor(useCase: GetCommodityListBySkuIdsUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: any, res: express.Response, next: express.NextFunction): Promise<any> {
    const dto = req.body as IGetCommodityListBySkuIdsDto

    try {
      const result = await this.useCase.execute(dto)
      if (result.isLeft()) {
        return this.fail(res, result.value.errorValue())
      }
      const commodityList = result.value.getValue()

      const getCommodiityListBySkuIdsFillRequestDtoList: IGetCommodiityListBySkuIdsFillRequestDto[] = []
      for (let item of dto.skuIds) {
        const commodity = commodityList.find((findItem) =>
          findItem.skus.getItems().some((someItem) => someItem.id.toString() == item)
        )
        if (!commodity) {
          return this.fail(res, new NotFoundError(`找不到skuId=${item}的商品`).errorValue().message)
        }
        getCommodiityListBySkuIdsFillRequestDtoList.push({
          ...(await CommodityMap.toDTO(commodity)),
          skuId: item,
        })
      }
      req.conmodityDtoList = getCommodiityListBySkuIdsFillRequestDtoList
      next()
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
