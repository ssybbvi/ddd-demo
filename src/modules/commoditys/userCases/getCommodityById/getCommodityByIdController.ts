import { BaseController } from '../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { GetCommodityByIdDto } from './getCommodityByIdDto'
import { Commodity } from '../../domain/commodity'
import { CommodityMap } from '../../mappers/CommodityMap'
import { GetCommodityByIdUseCase } from './getCommodityByIdUseCase'
import { CommodityDto } from '../../dtos/commodityDto'
import { GetCommodityErrors } from './getCommodityErrors'



export class GetCommodityByIdController extends BaseController {
  private useCase: GetCommodityByIdUseCase

  constructor(useCase: GetCommodityByIdUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: any, res: express.Response): Promise<any> {
    const dto: GetCommodityByIdDto ={
        commodityId:req.params.commodityId
    }

    try {
      const result = await this.useCase.execute(dto)
      let useCaseValue = result.value
      if (result.isLeft()) {
        const error = useCaseValue

        switch (error.constructor) {
          case GetCommodityErrors.CommodityNotFound:
            return this.notFound(res, error.errorValue().message)
          default:
            return this.fail(res, error.errorValue() + '')
        }
      } else {
        const commodity =useCaseValue.getValue() as Commodity
        const commodityDto=CommodityMap.toDTO(commodity)
        return this.ok<CommodityDto>(res,commodityDto)
      }
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
