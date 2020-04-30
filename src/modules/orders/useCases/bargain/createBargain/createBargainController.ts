import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { DecodedExpressRequest } from '../../../../users/infra/http/models/decodedRequest'
import { CreateBargainUseCase } from './createBargainUseCase'
import { CreateBargainDto } from './createBargainDto'
import { CreateBargainErrors } from './createBargainErrors'
import { Bargain } from '../../../domain/bargain'
import { BargainMap } from '../../../mappers/bargainMap'
import { IBargainDto } from '../../../dtos/bargainDto'
import { DotBuyRepeatOnceCommodityError } from '../../../domain/orderUser'
import { NotFoundError } from '../../../../../shared/core/NotFoundError'

export class CreateBargainController extends BaseController {
  private useCase: CreateBargainUseCase

  constructor(useCase: CreateBargainUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
    const { userId } = req.decoded;
    const dto: CreateBargainDto = req.body as CreateBargainDto
    dto.userId = userId

    try {
      const result = await this.useCase.execute(dto)

      if (result.isLeft()) {
        const error = result.value

        switch (error.constructor) {
          case NotFoundError:
            return this.fail(res, error.errorValue().message)
          case DotBuyRepeatOnceCommodityError:
            return this.fail(res, error.errorValue().message)
          case CreateBargainErrors.CommodityItemNotNullError:
            return this.fail(res, error.errorValue().message)
          case CreateBargainErrors.NotBargainCommodityError:
            return this.fail(res, error.errorValue().message)
          case CreateBargainErrors.DotMultipleBargainActivitiesError:
            return this.fail(res, error.errorValue().message)
          default:
            return this.fail(res, error.errorValue())
        }
      }

      const bargain = result.value.getValue() as Bargain
      const bargainDto = await BargainMap.toDTO(bargain)
      return this.ok<IBargainDto>(res, bargainDto)
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
