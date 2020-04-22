import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { DecodedExpressRequest } from '../../../../users/infra/http/models/decodedRequest'
import { CreateBargainOrderUseCase } from './createBargainOrderUseCase'
import { CreateBargainOrderDto } from './createBargainOrderDto'
import { CreateBargainOrderErrors } from './createBargainOrderErrors'
import { BargainOrder } from '../../../domain/bargainOrder'
import { BargainOrderMap } from '../../../mappers/bargainOrderMap'
import { IBargainOrderDto } from '../../../dtos/bargainOrderDto'

export class CreateBargainOrderController extends BaseController {
  private useCase: CreateBargainOrderUseCase

  constructor(useCase: CreateBargainOrderUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
    const { userId } = req.decoded;
    const dto: CreateBargainOrderDto = req.body as CreateBargainOrderDto
    dto.userId = userId

    try {
      const result = await this.useCase.execute(dto)

      if (result.isLeft()) {
        const error = result.value

        switch (error.constructor) {
          case CreateBargainOrderErrors.CommodityNotFoundError:
            return this.fail(res, error.errorValue().message)
          case CreateBargainOrderErrors.DotBuyRepeatOnceCommodityError:
            return this.fail(res, error.errorValue().message)
          case CreateBargainOrderErrors.OrderItemNotNullError:
            return this.fail(res, error.errorValue().message)
          case CreateBargainOrderErrors.NotBargainCommodityError:
            return this.fail(res, error.errorValue().message)
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
