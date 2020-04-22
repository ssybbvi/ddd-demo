import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { BargainOrder } from '../../../domain/bargainOrder'
import { BargainOrderMap } from '../../../mappers/bargainOrderMap'
import { IBargainOrderDto } from '../../../dtos/bargainOrderDto'
import { GetBargainOrderListUseCase } from './getBargainOrderListUseCase'
import { GetBargainOrderListDto } from './getBargainOrderListDto'

export class GetBargainOrderListController extends BaseController {
  private useCase: GetBargainOrderListUseCase

  constructor(useCase: GetBargainOrderListUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: any, res: express.Response): Promise<any> {
    const dto: GetBargainOrderListDto = req.query as GetBargainOrderListDto

    try {
      const result = await this.useCase.execute(dto)

      if (result.isLeft()) {
        const error = result.value

        switch (error.constructor) {

          default:
            return this.fail(res, error.errorValue())
        }
      }

      const bargainOrderList = result.value.getValue() as BargainOrder[]
      const bargainOrderListDto = bargainOrderList.map(item => BargainOrderMap.toDTO(item))
      return this.ok<IBargainOrderDto[]>(res, bargainOrderListDto)
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
