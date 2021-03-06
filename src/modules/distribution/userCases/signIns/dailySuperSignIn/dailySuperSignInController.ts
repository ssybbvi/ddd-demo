import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { DecodedExpressRequest } from '../../../../users/infra/http/models/decodedRequest'
import { DailySuperSignInUseCase } from './dailySuperSignInUseCase'
import { DailySuperSignInDto } from './dailySuperSignInDto'
import { DailySuperSignInDtoResult } from './dailySuperSignInDtoResult'
import { DailySuperSignInErrors } from './dailySuperSignInErrors'

export class DailySuperSignInController extends BaseController {
  private useCase: DailySuperSignInUseCase

  constructor(useCase: DailySuperSignInUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
    const { userId } = req.decoded

    const dto: DailySuperSignInDto = {
      userId: userId,
    }

    try {
      const result = await this.useCase.execute(dto)

      if (result.isLeft()) {
        return this.fail(res, result.value.errorValue())
      } else {
        return this.ok<DailySuperSignInDtoResult>(res, result.value.getValue())
      }
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
