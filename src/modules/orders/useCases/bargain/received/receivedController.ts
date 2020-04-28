import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { DecodedExpressRequest } from '../../../../users/infra/http/models/decodedRequest'

import { ReceivedUseCase } from './receivedUseCase'
import { ReceivedDto } from './receivedDto'
import { ReceivedErrors } from './receivedErrors'

export class ReceivedController extends BaseController {
  private useCase: ReceivedUseCase

  constructor(useCase: ReceivedUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
    const dto: ReceivedDto = req.body as ReceivedDto

    try {
      const result = await this.useCase.execute(dto)

      if (result.isLeft()) {
        const error = result.value

        switch (error.constructor) {
          case ReceivedErrors.NotFoundErrors:
            return this.fail(res, error.errorValue().message)
          default:
            return this.fail(res, error.errorValue())
        }
      }

      return this.ok<void>(res)
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
