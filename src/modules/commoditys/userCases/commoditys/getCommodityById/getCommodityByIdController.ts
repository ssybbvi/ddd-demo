import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { GetCommodityByIdDto } from './getCommodityByIdDto'
import { Commodity } from '../../../domain/commodity'
import { CommodityMap } from '../../../mappers/commodityMap'
import { GetCommodityByIdUseCase } from './getCommodityByIdUseCase'
import { CommodityDto } from '../../../dtos/commodityDto'
import { NotFoundError } from '../../../../../shared/core/NotFoundError'

export class GetCommodityByIdController extends BaseController {
  private useCase: GetCommodityByIdUseCase

  constructor(useCase: GetCommodityByIdUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: any, res: express.Response): Promise<any> {
    const dto: GetCommodityByIdDto = {
      commodityId: req.params.commodityId,
    }

    try {
      const result = await this.useCase.execute(dto)
      const resultValue = result.value
      if (result.isLeft()) {
        return this.fail(res, result.value.errorValue())
      } else {
        const commodity = resultValue.getValue() as Commodity
        const commodityDto = await CommodityMap.toDTO(commodity)
        return this.ok<CommodityDto>(res, commodityDto)
      }
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
