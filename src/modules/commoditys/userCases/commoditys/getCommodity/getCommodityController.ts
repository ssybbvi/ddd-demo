import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { GetCommodityUseCase } from './getCommodityUseCase'
import { GetCommodityDto } from './getCommodityDto'
import { GetCommodityDtoResult } from './getCommodityDtoResult'
import { Commodity } from '../../../domain/commodity'
import { CommodityMap } from '../../../mappers/commodityMap'

export class GetCommodityController extends BaseController {
  private useCase: GetCommodityUseCase

  constructor(useCase: GetCommodityUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: any, res: express.Response): Promise<any> {

    const dto: GetCommodityDto = {
      name: req.query.name || "",
      tag: req.query.tag || ""
    }

    try {
      const result = await this.useCase.execute(dto)

      if (result.isLeft()) {
        const error = result.value

        switch (error.constructor) {
          default:
            return this.fail(res, error.errorValue())
        }
      } else {
        const commodityList = result.value.getValue() as Commodity[]
        const commodityDtoList = await CommodityMap.toListDto(commodityList)
        return this.ok<GetCommodityDtoResult>(res, {
          commoditys: commodityDtoList
        })
      }
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
