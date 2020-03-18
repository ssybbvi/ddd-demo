import { BaseController } from '../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { GetCommodityUseCase } from './getCommodityUseCase'
import { GetCommodityDto } from './getCommodityDto'
import { GetCommodityDtoResult } from './getCommodityDtoResult'
import { CommodityDto } from '../../dtos/commodityDto'

export class GetCommodityController extends BaseController {
  private useCase: GetCommodityUseCase

  constructor(useCase: GetCommodityUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: any, res: express.Response): Promise<any> {
    const dto: GetCommodityDto = req.body as GetCommodityDto

    try {
      const result = await this.useCase.execute(dto)
      let useCaseValue = result.value
      if (result.isLeft()) {
        const error = useCaseValue

        switch (error.constructor) {
          default:
            return this.fail(res, error.errorValue() + '')
        }
      } else {
        // return this.ok<GetCommodityDtoResult>({
        //   commoditys: useCaseValue.getValue() as CommodityDto[]
        // })
      }
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
