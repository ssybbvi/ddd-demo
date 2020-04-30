import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { DecodedExpressRequest } from '../../../../users/infra/http/models/decodedRequest'
import { Bargain } from '../../../domain/bargain'
import { BargainMap } from '../../../mappers/bargainMap'
import { IBargainDto } from '../../../dtos/bargainDto'
import { GetBargainUseCase } from './getBargainUseCase'
import { GetBargainDto } from './getBargainDto'

export class GetBargainController extends BaseController {
  private useCase: GetBargainUseCase

  constructor(useCase: GetBargainUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: any, res: express.Response): Promise<any> {
    const dto: GetBargainDto = req.params as GetBargainDto

    try {
      const result = await this.useCase.execute(dto)

      if (result.isLeft()) {
        const error = result.value

        switch (error.constructor) {

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
