import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { DecodedExpressRequest } from '../../../../users/infra/http/models/decodedRequest'
import { ShipUseCase } from './shipUseCase'
import { ShipDto } from './shipDto'
import { ShipErrors } from './shipErrors'
import { RepeatShipmentError } from '../../../domain/deliveryInfo'

export class ShipController extends BaseController {
  private useCase: ShipUseCase

  constructor(useCase: ShipUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
    const dto: ShipDto = req.body as ShipDto

    try {
      const result = await this.useCase.execute(dto)

      if (result.isLeft()) {
        return this.fail(res, result.value.errorValue())
      }

      return this.ok<void>(res)
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
