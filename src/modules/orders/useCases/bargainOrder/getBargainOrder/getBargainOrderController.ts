import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { DecodedExpressRequest } from '../../../../users/infra/http/models/decodedRequest'
import { BargainOrder } from '../../../domain/bargainOrder'
import { BargainOrderMap } from '../../../mappers/bargainOrderMap'
import { IBargainOrderDto } from '../../../dtos/bargainOrderDto'
import { GetBargainOrderUseCase } from './getBargainOrderUseCase'
import { GetBargainOrderDto } from './getBargainOrderDto'

export class GetBargainOrderController extends BaseController {
  private useCase: GetBargainOrderUseCase

  constructor(useCase: GetBargainOrderUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: any, res: express.Response): Promise<any> {
    const dto: GetBargainOrderDto = req.params as GetBargainOrderDto

    try {
      const result = await this.useCase.execute(dto)

      if (result.isLeft()) {
        const error = result.value

        switch (error.constructor) {

          default:
            return this.fail(res, error.errorValue())
        }
      }

      const bargainOrder = result.value.getValue() as BargainOrder
      const bargainOrderDto = BargainOrderMap.toDTO(bargainOrder)
      return this.ok<IBargainOrderDto>(res, bargainOrderDto)
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
