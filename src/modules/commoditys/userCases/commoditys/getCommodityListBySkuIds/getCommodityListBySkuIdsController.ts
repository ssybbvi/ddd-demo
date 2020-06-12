import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { CommodityMap } from '../../../mappers/commodityMap'
import { GetCommodityListBySkuIdsUseCase } from './getCommodityListBySkuIdsUseCase'
import { IGetCommodityListBySkuIdsDto } from './getCommodityListBySkuIdsDto'
import { CommodityDto } from '../../../dtos/commodityDto'

export class GetCommodityListBySkuIdsController extends BaseController {
  private useCase: GetCommodityListBySkuIdsUseCase

  constructor(useCase: GetCommodityListBySkuIdsUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: any, res: express.Response): Promise<any> {
    const dto = req.body as IGetCommodityListBySkuIdsDto

    try {
      const result = await this.useCase.execute(dto)
      if (result.isLeft()) {
        return this.fail(res, result.value.errorValue())
      }
      const commodityList = result.value.getValue()
      const commodityDtoList = await CommodityMap.toListDto(commodityList)
      return this.ok<CommodityDto[]>(res, commodityDtoList)
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
