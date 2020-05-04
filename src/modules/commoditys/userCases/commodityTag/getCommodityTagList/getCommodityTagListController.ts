import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { CommodityTag } from '../../../domain/commodityTag'
import { CommodityTagMap } from '../../../mappers/commodityTagMap'
import { CommodityTagDto } from '../../../dtos/commodityTagDto'
import { GetCommodityTagListUseCase } from './getCommodityTagListUseCase'
import { GetCommodityTagListDto } from './getCommodityTagListDto'

export class GetCommodityTagListController extends BaseController {
  private useCase: GetCommodityTagListUseCase

  constructor(useCase: GetCommodityTagListUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const {} = req.body
    const dto: GetCommodityTagListDto = {}

    try {
      const result = await this.useCase.execute(dto)

      if (result.isLeft()) {
        return this.fail(res, result.value.errorValue())
      } else {
        const commodityTagList = result.value.getValue() as CommodityTag[]
        const commodityTagListDto = commodityTagList.map((item) => CommodityTagMap.toDTO(item))
        return this.ok<CommodityTagDto[]>(res, commodityTagListDto)
      }
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
