import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { GetCommodityUseCase } from './getCommodityUseCase'
import { GetCommodityDto } from './getCommodityDto'
import { GetCommodityDtoResult } from './getCommodityDtoResult'
import { Commodity } from '../../../domain/commodity'
import { CommodityMap } from '../../../mappers/commodityMap'
import { CommodityDto } from '../../../dtos/commodityDto'

export class GetCommodityController extends BaseController {
  private useCase: GetCommodityUseCase

  constructor(useCase: GetCommodityUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: any, res: express.Response): Promise<any> {
    const dto: GetCommodityDto = {
      name: req.query.name || '',
      tag: req.query.tag || '',
    }

    try {
      const result = await this.useCase.execute(dto)
      const resultValue = result.value
      if (result.isLeft()) {
        return this.fail(res, result.value.errorValue())
      } else {
        const commodityList = resultValue.getValue() as Commodity[]
        const commodityDtoList = await CommodityMap.toListDto(commodityList)
        return this.ok<CommodityDto[]>(res, commodityDtoList)
      }
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
